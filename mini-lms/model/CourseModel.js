export default class CourseModel {
    constructor(name, description) {
        this.id = crypto.randomUUID();
        this.name = name;
        this.description = description;
    }
}
