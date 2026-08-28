const admmodel = require('../models/administrativemodel')
const sendMail = require('../emailfunction/mail')
exports.createCompany = async(req,res)=>{
    const rdata = req.body;
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();
    const plainpassword = `${rdata.organisation_name}${dd}${mm}${yyyy}`;
    rdata.password = plainpassword;
    const data =  await admmodel.create(rdata)
    if(!rdata){
        return res.status(400).json({
            success:false,
            message:"bad request"
        })
    }
try{
   await sendMail(
    data.email,
    "Company Created Successfully",
    `
    <h2>Welcome ${data.organisation_name}</h2>
    <p>Your company has been created successfully.</p>
    <p>Username: ${data.organisation_name} </p>
    <p>password: ${plainpassword} </p>
    `
);}catch(error){
    console.error("email sending failed:",error)
}

    return res.status(200).json({
        success:true,
        message:"company created successfully",
        "created company":data
    })
}

exports.getAllCompany = async(req,res)=>{
    const data = await admmodel.find();
     if(!data){
        return res.status(400).json({
            message:"bad request"
        })
    }
    return res.status(200).json({
        message:"companies retrived successfully",
        data:data
    })

}

exports.getCompanyById = async(req,res)=>{
    const id = req.params.id;
    const data = await admmodel.findById(id);
    if(!data){
        return res.status(400).json({
            success:false,
            message:"no any company found"
        })
    }
    return res.status(200).json({
        success:true,
        message:"retrieved successfuly",
        data:data
    })
}

exports.updatecompany = async(req,res)=>{
    const id = req.params.id;
    const rdata = req.body;
    const updateddata = await admmodel.findByIdAndUpdate(id,rdata,{new:true,runValidators:true})

    if(!updateddata){
        return res.status(400).json({
            message: "no data found"
        })
    }
    return res.status(200).json({
        message:"updated successfully",
        data : updateddata
    })
}