const express = require("express");
const User=require('../module/User')
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const config = require('config');
const { body, validationResult, check } = require('express-validator');
const router  = new express.Router();


// @route POST  api/users
// @desc  Register a user
// @access public
router.post("/",[
    body("name" , "Please Enter name").not().isEmpty(),
    body("email","Enter valid email id").isEmail(),
    body("password"," Allowed password >=6 character").isLength({min:6})

], async(req,res)=>{
   const errors=validationResult(req);
   console.log(errors)
   if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

    const {name,email,password}=req.body;

     try{

        let user = await User.findOne({email});

          if(user){
            return res.status(400).json({msg:"Email already taken"})
          }

           user = new User({
            name,
            email,
            password
          })
          
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password,salt)
         await user.save();
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
     }catch(err){
       console.error(err.message)
       res.status(500).json({msg:err.message})
     }

})

module.exports =router;