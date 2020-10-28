const express = require('express');
const router = require('./router');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const port = 3020;

app.use(morgan('tiny'));
app.use(express.json());
app.use(cors());
app.use(router);

(async () => {
  try {
    app.listen(port, () => {
      console.log(`Solo server listening on localhost:${port} 🎉`)
    });
  } catch (err) {
    console.error('Connection error', err)
  }
})();