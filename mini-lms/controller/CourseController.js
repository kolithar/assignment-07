import { courses_db } from "../db/db.js";
import CourseModel from "../model/CourseModel.js";

let selectedCourseId = null;

function loadCourses() {
    $('#course-tbody').empty();
    courses_db.forEach((item, index) => {
        let data = `<tr data-id="${item.id}">
                        <td>${index + 1}</td>
                        <td>${item.name}</td>
                        <td>${item.description}</td>
                        <td>
                            <button class="btn btn-warning btn-sm update-course">Edit</button>
                            <button class="btn btn-danger btn-sm delete-course">Delete</button>
                        </td>
                    </tr>`;
        $('#course-tbody').append(data);
    });
}
loadCourses();

$('#course_save').on('click', function () {
    let name = $('#course').val().trim();
    let description = $('#description').val().trim();

    if (!name || !description) {
        Swal.fire('Error', 'All fields required', 'error');
        return;
    }

    if (selectedCourseId) {
        const course = courses_db.find(c => c.id === selectedCourseId);
        if (course) {
            course.name = name;
            course.description = description;
            Swal.fire('Updated!', '', 'success');
        }
        selectedCourseId = null;
    } else {
        const newCourse = new CourseModel(name, description);
        courses_db.push(newCourse);
        Swal.fire('Added!', '', 'success');
    }

    loadCourses();
    resetCourseForm();
});

$('#course_reset').on('click', function () {
    resetCourseForm();
});

function resetCourseForm() {
    $('#course, #description').val('');
    selectedCourseId = null;
}

$('#course-tbody').on('click', '.update-course', function () {
    const id = $(this).closest('tr').data('id');
    const course = courses_db.find(c => c.id === id);

    if (course) {
        $('#course').val(course.name);
        $('#description').val(course.description);
        selectedCourseId = course.id;
    }
});

$('#course-tbody').on('click', '.delete-course', function () {
    const id = $(this).closest('tr').data('id');

    Swal.fire({
        title: 'Delete?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!'
    }).then(result => {
        if (result.isConfirmed) {
            const index = courses_db.findIndex(c => c.id === id);
            if (index > -1) {
                courses_db.splice(index, 1);
                loadCourses();
                Swal.fire('Deleted!', '', 'success');
            }
        }
    });
});
