const mongoose = require('mongoose')

const contactschema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    contact:{
        type:Number,
        required:true
    },
    city:{
        type:String,
        required:true
    }
},{
    timestamps:true
});

module.exports = mongoose.model('contactinfo',contactschema);