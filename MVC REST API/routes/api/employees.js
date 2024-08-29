const express = require('express')
const router = express.Router();
const employeesController = require('../../controllers/employeesController')

// same route can show different results for different
// types of requests hence chaing is required

router.route('/')
    .get(employeesController.getAllEmployees)
    .post(employeesController.createNewEmployee)
    .put(employeesController.updateEmployee)
    .delete(employeesController.deleteEmployee)


router.route('/:id')
    .get(employeesController.getEmployee)

module.exports = router