const {Router} =require('express')
const { signup, getAllUsers, updateUser, updateEmployeeStatus, changePassword, getbyid } = require('../Controllers/usercontroller')
const { login } = require('../Controllers/logincontroller')
const route=Router()
const auth =require('../Controllers/Authcontroller')


route.post('/signup',signup)
route.post('/login',login)
route.get('/getusers',auth.protect,getAllUsers);
route.put('/update-user/:id',auth.protect,updateUser);
route.patch('/updateStatus-users/:id/status',auth.protect,updateEmployeeStatus);
route.patch('/CHPW-users/:id/change-password',auth.protect,changePassword);
route.get('/getbyuser/:id',auth.protect,getbyid)


module.exports=route