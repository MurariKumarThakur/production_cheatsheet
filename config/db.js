const mongoose=require('mongoose');
const config = require('config');
const dbconnection = config.get("mongoURI");

const connectDB =async()=>{

     try{
      await  mongoose.connect(dbconnection,{
            useNewUrlParser:true
            
          
        })

        console.log("mongo db connected")  
     }catch(e){
        console.log(e.message)
        process.exit(1)
     }

    }


//     mongoose.connect(dbconnection,{
//         useNewUrlParser:true
        
      
//     }).then(()=>{
//       console.log("mongo db connected")
//     }).catch(err=>{
//        console.log(err.message)
//        process.exit(1)
//     })
// }
module.exports=connectDB;