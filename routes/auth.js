const express = require("express");
const router  = new express.Router();
const { body, validationResult, check } = require('express-validator');
const bcrypt = require("bcryptjs");
const User = require("../module/User")

const config = require('config');
const jwt = require('jsonwebtoken');
const auth = require("../middleware/authm")
const { findOne } = require("../module/User");
// @route Get  api/auth
// @desc  Get logged in user
// @access private
router.get("/",auth,async(req,res)=>{
   
  
    try {
    //  console.log(req.user.id)
         const user = await User.findById(req.user.id).select('-password');
         res.send(user)
    } catch (error) {
      console.error(error.message)
      return res.status(500).json({msg:"Server error"})
    }

})

// @route post  api/auth
// @desc  Auth user & get token
// @access public
router.post("/",[
body("email","Please enter valid email").isEmail(),
body("password","please enter password").exists()
]
,async(req,res)=>{
    const errors=validationResult(req);
  
    if (!errors.isEmpty()) {
     return res.status(400).json({ errors: errors.array() });
   } 
   const {email,password}= req.body;

  try {
  
     let user = await User.findOne({email});
     if(!user){
        return res.status(400).json({msg:"Invalid Credencials"})
     }
    console.log(user)
   const isMatched=   await bcrypt.compare(password,user.password);

      if(!isMatched){
        return res.status(400).json({msg:"Invalid Credencials"})
      }

   

      const palyload={
        user:{
            id:user.id
        }
      }
      jwt.sign(palyload,config.get('jwtSecret'),{
        expiresIn:360000
      },(err,token)=>{
        if(err) throw err;
        res.json({token});
      })
    
  } catch (error) {
     console.error(error.message);
     res.status(500).send("server errror")
  }




})
router.post("/register",(req,res)=>{
    res.send("register router")
})

module.exports=router;