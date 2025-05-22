const {Router} = require('express');
const { addLeaveType, listLeaveTypes, getLeaveType, updateLeaveType, deleteLeaveType } = require('../Controllers/leaveTypeController');
const route = Router();
const auth =require('../Controllers/Authcontroller')

route.use(auth.protect)
route.post('/add-leave-types', addLeaveType);
route.get('/list-leave-types', listLeaveTypes);
route.get('/get-leave-types/:id', getLeaveType);
route.put('/update-leave-types/:id', updateLeaveType);
route.delete('/delete-leave-types/:id', deleteLeaveType);

module.exports = route;
