const mongoose = require('mongoose');
// const User =(require('./userModel.js'));

const Schema = mongoose.Schema;


const relativeSchema = new Schema(
  // 1st arg -> fields of the documents of this collection
  {
    // All users
    name: { type: String },
    firstApell: { type: String },
    secondApell: { type: String },
    //***  is better to use email as username 
    //***  than username + name + email , is too confusing  */
    relativeOfUser: [{ type: Schema.Types.ObjectId, ref:'User' }],
    email:    {type:String},
    phone:    {type:String},
    cIdentidad: { type:String},
    address:  {type:String},
    parentesco: {type:String},
    // country:    {type:String},    
    // role: { type: String,
    //         enum: [ 'guest', 'admin' ],
    //         default: 'guest'
    //         },
  },

  // 2nd arg -> additional options
  {
    // Adds createdAt & updatedAt to documents
    timestamps: true
  }
);

const Relative = mongoose.model('Relative', relativeSchema);


module.exports = Relative;