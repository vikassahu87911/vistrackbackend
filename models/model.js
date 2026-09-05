const mongoose = require('mongoose');
const bcrypt = require('bcrypt')


const schema = mongoose.Schema;

const managerSchema = new schema({
    Name_of_visitor:{
        type: String,
        required: true
    },
    orgid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Manager",
        required:true
    },
    uniqueno:{
        type:Number,
        default:()=>Math.floor(100000 + Math.random()*900000)
    },
    visitorEmail:{
        type: String,
        required: true
    },
    phone:{
        type:Number,
        required:true
    },
    password:{
        type: String
    },
    from_org:{
        type:String,
        required:true,
        default:"casual"
    },
    Venue:{
        type:String,
        default: null
    },
    DOV:{
        type: Date,
        required: true,
        validate:{
            validator:function(value){
                const today = new Date();
                today.setHours(0,0,0,0);
                return value>=today;
            },
            message:"date cannot be in tha past"
        }
    },
   
    Status:{
        type: String,
        enum:["active","checkedin","checkedout","cancelled","expired"],
        default: "active"
    },
    checkintime:{
        type: mongoose.Schema.Types.Mixed,
        default: null
    },
    checkouttime:{
        type: mongoose.Schema.Types.Mixed,
        default: null
    },
    qrtoken:{
        type:String,
        unique:true
    },
    vphoto:{
        type:String,
        default:null
    },
    mvphoto:{
        type:String,
        default:null
    }

   
},{timestamps:true});

managerSchema.index({orgid:1, visitorEmail:1},{unique:true,partialFilterExpression:{
    Status:{$in:["active","checkedin"]}
}})

managerSchema.pre("save", async function () {
    this.password = await bcrypt.hash(this.password,10);
}
)
module.exports = mongoose.model('visitorDetail',managerSchema);
