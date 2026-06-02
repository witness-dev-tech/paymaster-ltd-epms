const Employee = require('../models/employeeModel');

// 1. Onboard a new employee (Existing method)
exports.addEmployee = async (req, res) => {
    try {
        const empId = await Employee.create(req.body);
        res.status(201).json({ message: 'Employee added successfully', employeeNumber: empId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. Get a single employee profile (Existing method)
exports.getEmployeeProfile = async (req, res) => {
    try {
        const profile = await Employee.findProfileWithDepartment(req.params.empNum);
        if (!profile) return res.status(404).json({ message: 'Employee not found' });
        res.status(200).json(profile);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. Get all employees for baseline data indexing (Existing method)
exports.getAllEmployees = async (req, res) => {
    try {
        const totalEmployees = await Employee.findAll();
        res.status(200).json(totalEmployees);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// --- ADDED: 4. Update an existing employee profile via unique employeeNumber param ---
exports.updateEmployee = async (req, res) => {
    try {
        const { empNum } = req.params;
        const updated = await Employee.update(empNum, req.body);
        if (!updated) {
            return res.status(404).json({ message: 'Target employee profile record not found.' });
        }
        res.status(200).json({ message: 'Employee profile updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// --- ADDED: 5. Purge/Delete an employee from the database completely ---
exports.deleteEmployee = async (req, res) => {
    try {
        const { empNum } = req.params;
        const success = await Employee.delete(empNum);
        if (!success) {
            return res.status(404).json({ message: 'Target employee profile record not found.' });
        }
        res.status(200).json({ message: 'Employee node profile severed successfully from storage indices.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};