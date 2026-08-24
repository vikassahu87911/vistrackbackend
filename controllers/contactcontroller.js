const express = require('express');
const contactmodel = require('../models/contactmodel')

exports.createcontact = async(req,res)=>{
    const rdata = req.body
    const data = await contactmodel.create(rdata)
    if(!data){
       return res.json({
            success:false,
            
        })
    }

    return res.json({
        success:true,
        data:data
    })
}

exports.getallcontacts = async(req, res)=>{
    const data = await contactmodel.find();
    if(!data){
       return res.json({
            success:false,
            
        })
    }

    return res.json({
        success:true,
        data:data
    })
}