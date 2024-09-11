const mongoose = require('mongoose')

 const UserSchema = mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required: true
    },
    password:{
        type:String,
        required: true
    },
 });

 UserSchema.virtual('id').get(function (){
    return this._id.toHexString();
 })
 UserSchema.set('toJSON',{
    virtuals : true,
 })
exports.User = mongoose.model("User", UserSchema)
exports.UserSchema = UserSchema