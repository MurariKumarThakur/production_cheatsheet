const mongoose=require('mongoose');

 const SubjectSchema=mongoose.Schema({

    user:{
        type:mongoose.Schema.Types.ObjectId,
         ref:"users"
    },

    subject:{
        type:String,
        required:true,
       
    },
  
    date:{
        type:Date,
        default:Date.now
    },
 })


module.exports=mongoose.model('subject',SubjectSchema);