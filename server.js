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



const PORT=3000;
const app = express();

app.use(cors({
    origin:"http://localhost:3000"
}))



app.use(express.json());

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
        return res.json({
            success:true,
            message:"Login successful"
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
    if(manager.status!=="Active"){
        return res.status(401).json({
            success:false,
            message:"You are Inactive Pls contact administrator"
        });
    }

    if(!manager){
        return res.status(401).json({
            success:false,
            message:"invalid details"
        });
    }

    const ismatch = await bcrypt.compare(password,manager.password);
    if(!ismatch){
        return res.status(401).json({
            success:false,
            message:"invalid password"
        });
    }

    return res.json({
        companyname:manager.organisation_name,
        companyId:manager._id,
        success:true,
        message:"Login successful"
    })
})

app.post("/login/visitor",async(req,res)=>{
    const {visitorEmail,password,orgid} = req.body;
    const visitor = await visitorDetail.findOne({
        visitorEmail,
        orgid,
        Status:"active"
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
    return res.json({
        
        success:true,
        message:"Login successful",
        visitor:visitor
    })

})

app.post("/login/security",async(req,res)=>{
    const {email,password}=req.body;
    const security = await administrativemodel.findOne({
        email
    });
    if(security.status!=="Active"){
        return res.status(401).json({
            success:false,
            message:"You are set to inactive contact Manager"
        });
    }
    if(!security){
        return res.status(401).json({
            success:false,
            message:"invalid details"
        });
    }

    const ismatch = await bcrypt.compare(password,security.password);
    if(!ismatch){
        return res.status(401).json({
            success:false,
            message:"invalid password"
        });
    }

    return res.json({
        companyId:security._id,
        success:true,
        message:"Login successful"
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

