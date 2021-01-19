const express = require('express');
const router = require('./router');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path')

require('dotenv').config()

const app = express();
const port = process.env.PORT || 3020;

const corsConfig = {
  origin: 'http://localhost:3000',
  credentials: true,
};

app.use(morgan('tiny'));
app.use(express.json());
app.use(cors(corsConfig));
app.use(router);

app.listen(port, () => {
  console.log(`Solo server listening on localhost:${port} 🎉`)
});