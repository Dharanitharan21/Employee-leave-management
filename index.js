const express = require('express');
const http_server = express();
const cors = require('cors');
require('dotenv').config();
require('./Database/dbconfig')




http_server.use(express.json());
http_server.use(express.urlencoded({ extended: false }));
http_server.use(cors());

http_server.use('/', require('./app'));

// Set up the server to listen on the desired port

const port = process.env.PORT || 3306;
http_server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

