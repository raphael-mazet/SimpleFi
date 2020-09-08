const mongoose = require('./');

const tokenSchema = new mongoose.Schema(
  //TODO: update model
  {
    name: String,
    api_id: String,
    amount_bought: Number,
    price_bought: [{date: {
      type: Date,
      default: new Date(),
    }, price: Number}]
  }
)

const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;