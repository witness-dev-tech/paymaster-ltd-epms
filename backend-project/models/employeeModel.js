const db = require('../config/db');

class Employee {
    static async create(data) {
        const { employeeNumber, firstName, lastName, address, position, telephone, gender, hiredDate, departmentCode } = data;
        await db.execute(
            `INSERT INTO Employee (employeeNumber, firstName, lastName, address, position, telephone, gender, hiredDate, departmentCode) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [employeeNumber, firstName, lastName, address, position, telephone, gender, hiredDate, departmentCode]
        );
        return employeeNumber;
    }

    static async findById(employeeNumber) {
        const [rows] = await db.execute('SELECT * FROM Employee WHERE employeeNumber = ?', [employeeNumber]);
        return rows[0];
    }

    static async findProfileWithDepartment(employeeNumber) {
        const query = `
            SELECT e.*, d.departmentName 
            FROM Employee e
            LEFT JOIN Department d ON e.departmentCode = d.departmentCode
            WHERE e.employeeNumber = ?
        `;
        const [rows] = await db.execute(query, [employeeNumber]);
        return rows[0];
    }

    // --- UPGRADED: Pulls full metadata profiles to correctly fill out the frontend table data columns ---
    static async findAll() {
        const query = `
            SELECT e.*, d.departmentName 
            FROM Employee e
            LEFT JOIN Department d ON e.departmentCode = d.departmentCode
            ORDER BY e.firstName ASC
        `;
        const [rows] = await db.execute(query);
        return rows;
    }

    // --- ADDED: Handles mutations coming through the Edit Mode processing panel ---
    static async update(employeeNumber, data) {
        const { firstName, lastName, address, position, telephone, gender, hiredDate, departmentCode } = data;
        const query = `
            UPDATE Employee 
            SET firstName = ?, 
                lastName = ?, 
                address = ?, 
                position = ?, 
                telephone = ?, 
                gender = ?, 
                hiredDate = ?, 
                departmentCode = ? 
            WHERE employeeNumber = ?
        `;
        const [result] = await db.execute(query, [
            firstName, lastName, address, position, telephone, gender, hiredDate, departmentCode, employeeNumber
        ]);
        return result.affectedRows > 0;
    }

    // --- ADDED: Drops the workforce row entry node clean out of structural system storage ---
    static async delete(employeeNumber) {
        const [result] = await db.execute('DELETE FROM Employee WHERE employeeNumber = ?', [employeeNumber]);
        return result.affectedRows > 0;
    }
}

module.exports = Employee;