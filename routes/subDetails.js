const express = require("express");
const router  = new express.Router();
const Subject = require("../module/Subject");
const SubjectDetails = require("../module/SubjectDetails");
const auth =require("../middleware/authm")
const { body, validationResult, check } = require('express-validator');
// @route Get  api/subjects
// @desc  Get  all subjects
// @access private
router.get("/:id",auth, async(req,res)=>{
  console.log("request body",req.params)
  try {
    let details =  await SubjectDetails.find({subject:req.params.id}).sort({date:1});
    res.json(details)
  } catch (error) {
     console.error(error);
     res.status(500).json({errorMsg:error.message})
  }





   
})

// @route post  api/contacts
// @desc   create subjects
// @access public
router.post("/:id",[
  
    body("context","Please Enter subject header name").notEmpty(),
    body("code","please enter code"),
    body("description","please enter description").notEmpty(),
  
],auth,async(req,res)=>{
   
    const errors=validationResult(req);
    console.log(errors)
    if (!errors.isEmpty()) {
     return res.status(400).json({ errors: errors.array() });
   }
       const {context,code,description} =req.body;

   
     try {
      
        const newDetails =  new SubjectDetails({
          
            context,
            code,
            description,
            user:req.user.id,
            subject:req.params.id
        })
    const subdetail = await newDetails.save()
         res.json(subdetail)
     } catch (error) {
        console.error(error.message)
         res.status(500).json({error:"internal server error"})
     }




})



// @route PUT  api/subjects
// @desc   update subjects
// @access private
router.put("/:id",auth,async(req,res)=>{
    const {context,code,description} =req.body;
    const subdetails={};
    if(context) subdetails.context=context;
    if(code) subdetails.code=code;
    if(description) subdetails.description=description;
      try{
        let subDetail = await SubjectDetails.findById(req.params.id);
        if(!subDetail){
            return res.status(404).json({
                msg:"details not found"
            })
        }

        if(subDetail.user.toString() !=req.user.id){
            return res.status(401).json({
                msg:"Not authorized"
            })
        }

        subDetail = await SubjectDetails.findByIdAndUpdate(req.params.id,{$set:subdetails},{new:true})
         
         res.json(subDetail)



      }catch(err){
        console.error(err.message)
        res.status(500).json({error:"internal server error"})
      }


})

// @route DELETE  api/subjects
// @desc   update subjects
// @access private
router.delete("/:id",auth,async(req,res)=>{
    try{
        let sub = await SubjectDetails.findById(req.params.id);
        if(!sub){
            return res.status(404).json({
                msg:"Details not found"
            })
        }

        if(sub.user.toString() !=req.user.id){
            return res.status(401).json({
                msg:"Not authorized"
            })
        }

        await SubjectDetails.findByIdAndRemove(req.params.id)

          res.json({
            msg:"Record deleted successfully"
          })

      }catch(err){
        console.error(err.message)
        res.status(500).json({error:"internal server error"})
      }


})

module.exports=router;