const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const reviewSchema = new mongoose.Schema({
  created: {
    type: Date,
    default: Date.now
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: 'You need an author jabroni'
  },
  store: {
    type: mongoose.Schema.ObjectId,
    ref: 'Store',
    required: 'You need a store jabroni'
  },
  text: {
    type: String,
    required: 'Your review is empty jabroni'
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  }
});

function autopopulate(next) {
  this.populate('author');
  next();
}
reviewSchema.pre('find', autopopulate);
reviewSchema.pre('findOne', autopopulate);

module.exports = mongoose.model('Review', reviewSchema);