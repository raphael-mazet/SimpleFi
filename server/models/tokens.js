const mongoose = require('./');

const tokenSchema = new mongoose.Schema(
  //TODO: update model
  {
    name: String,
    apiId: String,
    transactions: [{
      date: {
        type: Date,
        default: new Date(),
      },
      bought: Boolean,
      price: Number,
      amount: Number,
    }]
  }
)

const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;