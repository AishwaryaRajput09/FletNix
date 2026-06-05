const mongoose = require('mongoose');

const showSchema = new mongoose.Schema({
  show_id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Movie', 'TV Show']
  },
  title: {
    type: String,
    required: true,
    index: true
  },
  director: String,
  cast: {
    type: String,
    index: true
  },
  country: String,
  date_added: String,
  release_year: Number,
  rating: String,
  duration: String,
  listed_in: String,
  description: String
});

showSchema.index({ title: 'text', cast: 'text' });

module.exports = mongoose.model('Show', showSchema);
