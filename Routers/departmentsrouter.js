const {Router}= require('express');
const { addDepartment, listDepartments, getDepartment, updateDepartment, deleteDepartment } = require('../Controllers/departmentController');
const route =Router();
const auth =require('../Controllers/Authcontroller')

route.use(auth.protect)
route.post('/addDepartments',addDepartment);
route.get('/listdepartments', listDepartments);
route.get('/getdepartments/:id', getDepartment);
route.put('/updatedepartments/:id', updateDepartment);
route.delete('/deletedepartments/:id', deleteDepartment);

module.exports = route;
