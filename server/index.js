const express = require('express');
const router = require('./router');
const cors = require('cors');
const morgan = require('morgan');

require('dotenv').config()

const app = express();
const port = process.env.PORT || 3020;

app.use(morgan('tiny'));
app.use(express.json());
app.use(cors());
app.use(router);

app.listen(port, () => {
  console.log(`Solo server listening on localhost:${port} 🎉`)
});