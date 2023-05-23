const express=require("express");
const app = express();
const path = require("path")
const connectDB = require("./config/db")
const userroutes= require("./routes/users");
const authroutes= require("./routes/auth")
const subjectroutes=require("./routes/subjects")
const subjectDetailsroutes=require("./routes/subDetails")
app.use(express.json({extended:false}))
connectDB();
 app.use("/api/users",userroutes);
 app.use("/api/auth",authroutes);
 app.use("/api/subjects",subjectroutes);
 app.use("/api/subdetails",subjectDetailsroutes);

 if(process.env.NODE_ENV=="production"){
    app.use(express.static("cheetsheef_front/build"));
    app.get('*',(req,res)=> res.sendFile(path.resolve(__dirname,'cheetsheef_front','build','index.html')))
 }



// app.use("/api/auth",require("./routes/auth"));
// app.use("/api/subjects",require("./routes/subjects"));
const PORT = process.env.POR || 6000;
app.listen(PORT,()=>console.log('server started'));