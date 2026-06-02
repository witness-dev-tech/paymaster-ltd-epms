const express = require('express');
const empController = require('../controllers/employeeController');
const router = express.Router();

// 1. Route to onboard a brand new employee profile
router.post('/', empController.addEmployee);

// 2. Route to handle fetching ALL employees globally (Fills the dashboard index directory)
router.get('/', empController.getAllEmployees); 

// 3. Route to get a specific employee by their identifier number
router.get('/:empNum', empController.getEmployeeProfile);

// --- ADDED FOR CRUD SYNC ---

// 4. Route to handle editing/mutating an existing profile record
router.put('/:empNum', empController.updateEmployee);

// 5. Route to completely purge an employee entry node from the database storage index
router.delete('/:empNum', empController.deleteEmployee);

module.exports = router;