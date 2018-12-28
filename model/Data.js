const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
  content: String,
});

const Data = mongoose.model('Data', dataSchema);

module.exports = Data;
