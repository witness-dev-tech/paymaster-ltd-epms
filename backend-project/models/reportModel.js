const db = require('../config/db');

class Report {
    static async generateSummary(intervalType) {
        let employeeDateCondition = '';
        let salaryDateCondition = '';

        // Standardizing date parameters to pull payroll metrics accurately
        if (intervalType === 'DAILY') {
            employeeDateCondition = 'e.hiredDate = CURDATE()';
            salaryDateCondition = 's.monthOfPayment = DATE_FORMAT(CURDATE(), "%Y-%m")';
        } else if (intervalType === 'WEEKLY') {
            employeeDateCondition = 'e.hiredDate >= DATE_SUB(CURDATE(), INTERVAL 1 WEEK)';
            salaryDateCondition = 's.monthOfPayment = DATE_FORMAT(CURDATE(), "%Y-%m")';
        } else if (intervalType === 'MONTHLY') {
            employeeDateCondition = 'e.hiredDate >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)';
            salaryDateCondition = 's.monthOfPayment = DATE_FORMAT(CURDATE(), "%Y-%m")';
        }

        // UPGRADE 1: LEFT JOIN keeps all departments visible even with 0 new hires
        const employeeQuery = `
            SELECT 
                d.departmentName,
                COUNT(e.employeeNumber) AS totalNewEmployees,
                IFNULL(GROUP_CONCAT(CONCAT(e.firstName, ' ', e.lastName)), 'No new hires') AS employeeList
            FROM Department d
            LEFT JOIN Employee e ON d.departmentCode = e.departmentCode AND ${employeeDateCondition}
            GROUP BY d.departmentName, d.departmentCode
        `;

        // UPGRADE 2: Aggregates salaries by payment period instead of when an employee was hired
        // UPGRADE 3: IFNULL protects the frontend from crashing on empty tables
        const salaryQuery = `
            SELECT 
                COUNT(DISTINCT s.employeeNumber) AS totalEmployeesPaid,
                IFNULL(SUM(s.grossSalary), 0) AS totalGrossPayout,
                IFNULL(SUM(s.totalDeduction), 0) AS totalDeductionsWithheld,
                IFNULL(SUM(s.netSalary), 0) AS totalNetPayout
            FROM Salary s
            WHERE ${salaryDateCondition}
        `;

        const [employeeStats] = await db.execute(employeeQuery);
        const [salaryStats] = await db.execute(salaryQuery);

        return {
            reportType: intervalType,
            generatedAt: new Date().toISOString(),
            departmentBreakdown: employeeStats,
            financialSummary: salaryStats[0] || {
                totalEmployeesPaid: 0,
                totalGrossPayout: 0,
                totalDeductionsWithheld: 0,
                totalNetPayout: 0
            }
        };
    }
}

module.exports = Report;