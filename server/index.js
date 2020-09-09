const express = require('express');
const router = require('./router');
const cors = require('cors');
const morgan = require('morgan');

const mongoose = require('./models/index');
const app = express();
const port = 3020;

app.use(morgan('tiny'));
app.use(express.json());
app.use(cors());
app.use(router);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('SimpleFi DB connected 🐻');
  app.listen(port, () => {
    console.log(`Solo server listening on localhost:${port} 🎉`)
  });
});
