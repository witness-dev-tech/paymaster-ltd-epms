const db = require('../config/db');

class Salary {
    static async create(data) {
        const { employeeNumber, monthOfPayment, grossSalary, totalDeduction } = data;
        const [result] = await db.execute(
            `INSERT INTO Salary (employeeNumber, monthOfPayment, grossSalary, totalDeduction) 
             VALUES (?, ?, ?, ?)`,
            [employeeNumber, monthOfPayment, grossSalary, totalDeduction]
        );
        return { id: result.insertId, employeeNumber, monthOfPayment };
    }

    static async findByEmployee(employeeNumber) {
        const [rows] = await db.execute(
            'SELECT *, (grossSalary - totalDeduction) AS netSalary FROM Salary WHERE employeeNumber = ? ORDER BY monthOfPayment DESC', 
            [employeeNumber]
        );
        return rows;
    }

    // --- ADDED: 1. Fetch all salary statements globally ---
    static async findAll() {
        const [rows] = await db.execute(
            'SELECT *, (grossSalary - totalDeduction) AS netSalary FROM Salary ORDER BY monthOfPayment DESC'
        );
        return rows;
    }

    // --- ADDED: 2. Update an existing record via row ID ---
    static async update(id, data) {
        const { monthOfPayment, grossSalary, totalDeduction } = data;
        const [result] = await db.execute(
            `UPDATE Salary 
             SET monthOfPayment = ?, grossSalary = ?, totalDeduction = ? 
             WHERE id = ?`, // If your primary key column is named "salaryId", change "id = ?" to "salaryId = ?"
            [monthOfPayment, grossSalary, totalDeduction, id]
        );
        return result.affectedRows > 0;
    }

    // --- ADDED: 3. Purge a record via row ID ---
    static async delete(id) {
        const [result] = await db.execute('DELETE FROM Salary WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = Salary;