const express = require('express')
const router = express.Router();
const employeesController = require('../../controllers/employeesController')
const ROLES_LIST = require('../../config/roles_list')
const verifyRoles = require('../../middleware/verifyRoles')

// same route can show different results for different
// types of requests hence chaing is required

router.route('/')
    .get(employeesController.getAllEmployees)
    // in get, roles are not required but in other routes, roles needs to be verified
    .post(verifyRoles({admin: ROLES_LIST.Admin, editor: ROLES_LIST.Editor, user: ROLES_LIST.User}), employeesController.createNewEmployee)
    .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),employeesController.updateEmployee)
    .delete(verifyRoles(ROLES_LIST.Admin),employeesController.deleteEmployee)


router.route('/:id')
    .get(employeesController.getEmployee)

module.exports = router