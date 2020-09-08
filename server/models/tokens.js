const mongoose = require('./');

const tokenSchema = new mongoose.Schema(
  {
    name: String,
    price_bought: [{date: {
      type: Date,
      default: new Date(),
    }, price: Number}]
  }
)

const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;