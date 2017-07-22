const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const agencySchema = new Schema(
  // 1st arg -> fields of the documents of this collection
  {
    // All users
    nameAgency: { type: String },
    email:           {type:String},
    usersWithThisAgency: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    //contactPhone:    {type:String},
    //address:         {type:String},
    //country:         {type:String},
    // Traditional registration users
    //username: { type: String },
    //encryptedPassword: { type: String },
  },

  // 2nd arg -> additional options
  {
    // Adds createdAt & updatedAt to documents
    timestamps: true
  }
);

const agency = mongoose.model('Agency', agencySchema);


module.exports = agency;