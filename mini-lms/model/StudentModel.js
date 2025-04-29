export default class StudentModel {
    constructor(fname, lname, address) {
        this.id = crypto.randomUUID();
        this.fname = fname;
        this.lname = lname;
        this.address = address;
    }
}
