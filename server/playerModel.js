const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const playerSchema = new Schema({
  player: {type: String, required: true},
  cards: {type: String},
  hand: {type: String},
  currentplayer: {type: String},
  number: {type: String}
});

module.exports = mongoose.model('Player', playerSchema);