const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');
const storeSchema = new mongoose.Schema({
  name: {
    type: String, 
    trim: true,
    required: 'Please enter a store name.'
  },
  slug: String,
  description: {
    type: String,
    trim: true
  },
  tags: [String],
  created: {
    type: Date,
    default: Date.now
  },
  location: {
   type: {
     type: String,
     default: 'Point'
   },
   coordinates: [
     {
       type: Number,
       required: 'You must supply coords!'
     }
   ],
   address: {
     type: String,
     required: 'You must supply an address!'
   } 
  },
  photo: String,
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: 'You must supply an author jabroni'
  }
},{
  toJSON: {virtuals: true},
  toObject: {virtuals: true}
});

storeSchema.index({
  name: 'text',
  description: 'text'
});

storeSchema.index({
  location: '2dsphere'
});

storeSchema.pre('save', async function(next){
  if(!this.isModified('name')){
    next();
    return;
  }
  this.slug = slug(this.name);
  //find any stores with same slug beginning store-1, store-2, etc

  const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
  const storesWithSlug = await this.constructor.find({slug: slugRegEx});
  if(storesWithSlug.length) {
    this.slug = `${this.slug}-${storesWithSlug.length +1}`;
  }
  next();
});

storeSchema.statics.getTagsList = function() {
  return this.aggregate([
    { $unwind: '$tags' },
    { $group: { _id: '$tags', count: {$sum: 1} }},
    { $sort: { count: -1 }}
  ]);
}


storeSchema.statics.getTopStores = function(){
  return this.aggregate([
    //lookup stores and populate reviews
    { $lookup: { from: 'reviews', localField: '_id', foreignField: 'store', as: 'reviews' }},
    //filter for ones with 2 or more
    { $match: {'reviews.1': { $exists: true } }},
    //add avg reviews field
    { $project: {
      photo: '$$ROOT.photo',
      name: '$$ROOT.name',
      reviews: '$$ROOT.reviews',
      slug: '$$ROOT.slug',
      averageRating: { $avg: '$reviews.rating' }
    }},
    //sort
    { $sort: { averageRating: -1 }},
    //limit to at most 10
    { $limit: 10 }
  ]);
}

//_id property = reviews(store)
storeSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id', //which field on store
  foreignField: 'store' //which field on review
});

function autopopulate(next) {
  this.populate('reviews');
  next();
}

storeSchema.pre('find', autopopulate);
storeSchema.pre('findOne', autopopulate);

//TODO beef up presave slug stuff
module.exports = mongoose.model('Store', storeSchema);