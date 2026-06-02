const Department = require('../models/departmentModel');

exports.addDepartment = async (req, res) => {
    try {
        const { departmentCode, departmentName } = req.body;
        const newDept = await Department.create(departmentCode, departmentName);
        res.status(201).json({ message: 'Department added!', data: newDept });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllDepartments = async (req, res) => {
    try {
        const depts = await Department.findAll();
        res.status(200).json(depts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};