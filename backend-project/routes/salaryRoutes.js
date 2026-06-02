const express = require('express');
const salaryController = require('../controllers/salaryController');
const router = express.Router();

// 1. Create a new salary payout record (Left Form panel submission)
router.post('/', salaryController.processPayout);

// 2. Fetch ALL salary statements globally (Populates frontend table view by default on mount)
router.get('/', salaryController.getAllStatements);

// 3. Fetch statements tracking history for a single specific employee
router.get('/:empNum', salaryController.getEmployeeStatement);

// 4. Update an existing statement record entry via unique id route parameter
router.put('/:id', salaryController.updatePayout);

// 5. Purge/Remove a salary transaction from database rows completely
router.delete('/:id', salaryController.deletePayout);

module.exports = router;