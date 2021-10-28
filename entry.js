require('dotenv').config();
const app = require('./src/app');

const appBuilder = async () => {
  app();
}



appBuilder()
  .then(() => console.log('started!'))
  .catch((e) => console.error(e));

