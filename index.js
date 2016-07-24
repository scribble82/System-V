require('babel-register');
require('babel-polyfill');

const email = require('./lib/email');

email.checkForMessage()
.then((content) => console.log(content))
.catch((err) => console.log(err));
