const express = require('express');
const deptController = require('../controllers/departmentController');
const router = express.Router();

router.post('/', deptController.addDepartment);
router.get('/', deptController.getAllDepartments);

module.exports = router;