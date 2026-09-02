const express = require('express');
const sendMail = require('../emailfunction/mail')
const visitorschema = require('../models/model')
const {v4:uuidv4} = require("uuid")
exports.createVisitor = async (req,res)=>{
    
    try{
    const data = req.body;
    const password = data.Name_of_visitor.substring(0,3).toUpperCase()+data.phone;
    data.password = password;
    data.qrtoken = uuidv4();
    const newvisitor = await visitorschema.create(data); 
         res.status(200).json({
        message: "visitor created successfully",
        data: newvisitor
    })
    sendMail(
    newvisitor.visitorEmail,
    "visit Created Successfully",
    `
    <h2>Welcome ${newvisitor.Name_of_visitor}</h2>
    <p>Your visit has been created successfully at ${newvisitor.Venue}.</p>
    <p>Username: ${newvisitor.visitorEmail} </p>
    <p>password: ${password} </p>
    <p> unique id for login : ${newvisitor.orgid}</p>
    <p>your otp: ${newvisitor.uniqueno} needs to be verified during visit, pls share tp the concerned person</p>
    `
    ).then(()=>{
        console.log("email sent successfully")
    }).catch((error)=>{
        console.error("email sending failed",error)
    });

    

   }catch(error){
    
      return res.status(400).json({
        message: error.message
       })
    }

    
}

exports.getAllVisitors = async(req,res) =>{
    const {orgid} = req.params;
    console.log(orgid)

    const today = new Date();
    today.setHours(0,0,0,0);
    await visitorschema.updateMany(
        {
            DOV: {$lt: today},
            Status:{$ne:"checkedout" || "checkedin" || "cancelled" || "expired"}
        },
        {
            $set:{Status:"expired",checkintime:"not available",checkouttime:"not available"}
        }
    );
    await visitorschema.updateMany(
        {
            Status:"cancelled"
        },
        {
            $set:{checkintime:"not available",checkouttime:"not available"}
        }
    );

    const data = await visitorschema.find({orgid});
    if(!data){
       return res.status(400).json({
            message:"no data found"
        })
    }

    return res.status(200).json({
        message:"retrive successfully",
        data: data
    })

}

exports.getVisitorById = async(req,res)=>{
    const id= req.params.id;
    const data = await visitorschema.findById(id)
     if(!data){
        return res.status(400).json({
            message:"No visitor exists for the given id"
        })
    }

    return res.status(200).json({
        success:true,
        "data": data
    })
}

exports.deleteVisitorbyId = async(req,res)=>{
    const id = req.params.id;
    const data = await visitorschema.findByIdAndDelete(id)
    if(!data){
        return res.status(400).json({
            message:"No visitor exists for the given id"
        })
    }

    return res.status(200).json({
        message:"deleted sucessfully",
        "deleted data": data
    })
}

exports.updateVisitorById = async(req,res) =>{
    const id = req.params.id;
    const rdata = req.body
    const data = await visitorschema.findByIdAndUpdate(id,rdata,{new:true,runValidators:true})
    if(!data){
        return res.status(400).json({
            message: "no data found"
        })
    }
    return res.status(200).json({
        message:"updated successfully",
        data: data
    })
   

}

exports.verifyQR = async (req, res) => {

    try {

        const { qrtoken } = req.body;

        const visitor = await visitorschema.findOne({
            qrtoken: qrtoken
        });

        if (!visitor) {
            return res.status(404).json({
                message: "Invalid QR code"
            });
        }

        if (visitor.Status !== "active") {
            return res.status(403).json({
                message: "Visitor is not approved"
            });
        }

        return res.status(200).json({
            message: "Visitor verified successfully",
            visitor: visitor
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            message: error.message
        });
    }
};