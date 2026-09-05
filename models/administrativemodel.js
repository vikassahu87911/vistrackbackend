const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const admschema = new mongoose.Schema({
    organisation_name:{
        type:String,
        required:true,
        unique: true
    },
    datetimeofcreation:{
        type: Date,
        default:Date.now
    },
    password:{
        type:String
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    status:{
        type: String,
        enum:["Active","Inactive"],
        default: "Active"
    },
    planAmount:{
        type:Number,
        default:9999

    }

    
})




admschema.pre("save", async function () {
     this.password = await bcrypt.hash(this.password,10);
});

module.exports = mongoose.model("admrecord",admschema)