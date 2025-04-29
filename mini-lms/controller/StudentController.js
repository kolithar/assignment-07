import { students_db } from "../db/db.js";
import StudentModel from "../model/StudentModel.js";

let selectedStudentId = null;

function loadStudents() {
    $('#student-tbody').empty();
    students_db.forEach((item, index) => {
        let data = `<tr data-id="${item.id}">
                        <td>${index + 1}</td>
                        <td>${item.fname}</td>
                        <td>${item.lname}</td>
                        <td>${item.address}</td>
                        <td>
                            <button class="btn btn-warning btn-sm update-student">Edit</button>
                            <button class="btn btn-danger btn-sm delete-student">Delete</button>
                        </td>
                    </tr>`;
        $('#student-tbody').append(data);
    });
}
loadStudents();

$('#student_save').on('click', function () {
    let fname = $('#fname').val().trim();
    let lname = $('#lname').val().trim();
    let address = $('#address').val().trim();

    if (!fname || !lname || !address) {
        Swal.fire('Error', 'All fields required', 'error');
        return;
    }

    if (selectedStudentId) {
        // Update
        const student = students_db.find(s => s.id === selectedStudentId);
        if (student) {
            student.fname = fname;
            student.lname = lname;
            student.address = address;
            Swal.fire('Updated!', '', 'success');
        }
        selectedStudentId = null;
    } else {
        // Save
        const newStudent = new StudentModel(fname, lname, address);
        students_db.push(newStudent);
        Swal.fire('Added!', '', 'success');
    }

    loadStudents();
    resetForm();
});

$('#student_reset').on('click', function () {
    resetForm();
});

function resetForm() {
    $('#fname, #lname, #address').val('');
    selectedStudentId = null;
}

// Edit
$('#student-tbody').on('click', '.update-student', function () {
    const id = $(this).closest('tr').data('id');
    const student = students_db.find(s => s.id === id);

    if (student) {
        $('#fname').val(student.fname);
        $('#lname').val(student.lname);
        $('#address').val(student.address);
        selectedStudentId = student.id;
    }
});

// Delete
$('#student-tbody').on('click', '.delete-student', function () {
    const id = $(this).closest('tr').data('id');

    Swal.fire({
        title: 'Delete?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!'
    }).then(result => {
        if (result.isConfirmed) {
            const index = students_db.findIndex(s => s.id === id);
            if (index > -1) {
                students_db.splice(index, 1);
                loadStudents();
                Swal.fire('Deleted!', '', 'success');
            }
        }
    });
});
