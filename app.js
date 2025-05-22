const express = require('express');
const app_server = express();
app_server.use(express.json());
app_server.use(express.urlencoded({ extended: false }));

app_server.use('/api',require('./Routers/userdatarouter'))
app_server.use('/api',require('./Routers/departmentsrouter'))
app_server.use('/api',require('./Routers/leaveTypesrouter'))
app_server.use('/api',require('./Routers/leaveApplicationsrouter'))


module.exports = app_server;
