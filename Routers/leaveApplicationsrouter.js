const express = require('express');
const { applyLeave, getAllLeaveApplications, getUserLeaveApplications, getLeaveApplicationById, updateLeaveStatus, deleteLeaveApplication, getApplicationsByStatus } = require('../Controllers/leaveApplicationController');
const route = express.Router();
const auth =require('../Controllers/Authcontroller')

route.use(auth.protect)
route.post('/leave-applications', applyLeave);
route.get('/list-leave-applications', getAllLeaveApplications);
route.get('/getbyuser-leave-applications/user/:user_id', getUserLeaveApplications);
route.get('/getbyId-leave-applications/:id', getLeaveApplicationById); 
route.put('/upadte-leave-applications/status/:id', updateLeaveStatus);
route.delete('/delete-leave-applications/:id', deleteLeaveApplication);
route.get('/getbyStatus-leave-applications/status/:status', getApplicationsByStatus);


module.exports = route;
