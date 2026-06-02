const db = require('../config/db');

class Department {
    static async create(departmentCode, departmentName) {
        await db.execute(
            'INSERT INTO Department (departmentCode, departmentName) VALUES (?, ?)',
            [departmentCode, departmentName]
        );
        return { departmentCode, departmentName };
    }

    static async findAll() {
        const [rows] = await db.execute('SELECT * FROM Department');
        return rows;
    }
}

module.exports = Department;