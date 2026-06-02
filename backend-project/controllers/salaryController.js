const Salary = require('../models/salaryModel');

// 1. Create a new salary record (Existing method)
exports.processPayout = async (req, res) => {
    try {
        const record = await Salary.create(req.body);
        res.status(201).json({ message: 'Salary recorded successfully', record });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. Fetch payroll history for a single employee (Existing method)
exports.getEmployeeStatement = async (req, res) => {
    try {
        const history = await Salary.findByEmployee(req.params.empNum);
        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// --- ADDED: 3. Fetch all salary statements globally for default layout view ---
exports.getAllStatements = async (req, res) => {
    try {
        // Calls a model function to retrieve all rows from the database
        const entries = await Salary.findAll();
        res.status(200).json(entries);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// --- ADDED: 4. Update an existing salary statement by its unique ID ---
exports.updatePayout = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await Salary.update(id, req.body);
        if (!updated) {
            return res.status(404).json({ message: 'Target salary statement entry point not found.' });
        }
        res.status(200).json({ message: 'Salary record updated successfully', updated });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// --- ADDED: 5. Purge/Remove an existing salary statement entry from rows ---
exports.deletePayout = async (req, res) => {
    try {
        const { id } = req.params;
        const success = await Salary.delete(id);
        if (!success) {
            return res.status(404).json({ message: 'Target salary statement entry point not found.' });
        }
        res.status(200).json({ message: 'Salary statement successfully purged from database memory.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};