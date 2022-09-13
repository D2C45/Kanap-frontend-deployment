const dotenv = require('dotenv');
dotenv.config();

let config = {
    host: process.env.API_URL
}

export {config};