const express = require('express');
const mongoose = require('mongoose')
require('dotenv').config();
const bcrypt = require('bcrypt')
const administrativemodel = require('./models/administrativemodel')
const visitorDetail = require('./models/model')

const visitorrouter = require('./routers/visitorsRoute');
const admrouter = require('./routers/admRoute');
const contactrouter = require('./routers/contactRoute')
const cors = require("cors")
const jwt = require('jsonwebtoken');



const PORT=5000;
const app = express();

app.use(cors({
    origin:"http://localhost:3000"
    // origin:"https://viztrack.netlify.app"
}))



app.use(express.json({limit:'10mb'}));

app.get("/",(req,res)=>{
     return res.status(200).json({
        msg:"well done"
        
    })
})

app.post("/login/admin", async(req,res)=>{
    const {userid,password}=req.body;
    if(
        userid===process.env.ADM_ID &&
        password===process.env.ADM_PASSWORD
    ){
        const token = jwt.sign(
            {
                userid:userid,
                role:"admin"
            },
            process.env.JWT_SECRET,
            {
                expiresIn:"1h"
            }
        );
        return res.json({
            success:true,
            message:"Login successful",
            token:token
        });
    }
    res.status(401).json({
        success:false,
        message:"invalid details"
    })
})

app.post("/login/manager",async(req,res)=>{
    const {email,password}=req.body;
    const manager = await administrativemodel.findOne({
        email
    });

     if(!manager){
        return res.status(401).json({
            success:false,
            message:"invalid details"
        });
    }

    if(manager.status!=="Active"){
        return res.status(401).json({
            success:false,
            message:"You are Inactive Pls contact administrator"
        });
    }

    const ismatch = await bcrypt.compare(password,manager.password);
    if(!ismatch){
        return res.status(401).json({
            success:false,
            message:"invalid password"
        });
    }

    //create jwt
    const token = jwt.sign(
        {
            userid:manager._id,
            role:"manager"
        },
        process.env.JWT_SECRET,
        {
            expiresIn:"1h"
        }
    )

    return res.json({
        companyname:manager.organisation_name,
        companyId:manager._id,
        success:true,
        message:"Login successful",
        token:token
    })
})

app.post("/login/visitor",async(req,res)=>{
    const {visitorEmail,password,orgid} = req.body;
    const visitor = await visitorDetail.findOne({
        visitorEmail,
        orgid,
        Status:{ $in: ["active", "checkedin"] }
    })
    if(!visitor){
        return res.status(401).json({
            success:false,
            message:"invalid details"
            
        });
    }

    const ismatch = await bcrypt.compare(password,visitor.password);
    if(!ismatch){
        return res.status(401).json({
            success:false,
            message:"invalid password"
        });
    }

    // creating visitortoken

    const token = jwt.sign(
        {
            userid:visitor._id,
            role:"visitor"
        },
        process.env.JWT_SECRET,
        {
            expiresIn:"1h"
        }
    )
    return res.json({
        
        success:true,
        message:"Login successful",
        visitorid:visitor._id,
        token:token
    })

})

app.post("/login/security",async(req,res)=>{
    const {email,password}=req.body;
    const security = await administrativemodel.findOne({
        email
    });

     if(!security){
        return res.status(401).json({
            success:false,
            message:"invalid details"
        });
    }

    if(security.status!=="Active"){
        return res.status(401).json({
            success:false,
            message:"You are set to inactive contact Manager"
        });
    }

    const ismatch = await bcrypt.compare(password,security.password);
    if(!ismatch){
        return res.status(401).json({
            success:false,
            message:"invalid password"
        });
    }


    //create json token
    const token = jwt.sign(
        {
            userid: security._id,
            role:"security"
        },
        process.env.JWT_SECRET,
        {
            expiresIn:"1h"
        }
    )

    return res.json({
        companyId:security._id,
        success:true,
        message:"Login successful",
        token:token
    })
})

    

app.use('/', visitorrouter);
app.use('/', admrouter);
app.use('/', contactrouter);



mongoose.connect(process.env.MONGO_URI).then(async()=>{
    await mongoose.model("visitorDetail").syncIndexes();
    await mongoose.model("admrecord").syncIndexes();
        app.listen(PORT,"0.0.0.0",()=>{
            console.log(`server is live at port http://localhost:${PORT} and connected to DB`)
        });
    }).catch((err)=>{
        console.log("some error occured while connecting to DB");
        console.log(err);
    })

