require("dotenv").config
const config = require("./config/config");
const environment = process.env.NODE_ENV
console.log(config[environment])
console.log(config.development)