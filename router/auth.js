
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authenticate = require("../middleware/authenticate");
const rootUser = require("../middleware/authenticate");

require("../db/conn"); 
const User = require("../model/userSchema");



// Using async menthod

 router.post("/register",async (req,res)=>{
        const {name,email,password,cpassword}=req.body;
        if(!name|| !email || !password|| !cpassword ){
            return res.status(422 ).json({error:"pls fill the feild properly"});
        }

        try{
          const userexist = await User.findOne({email:email});
            if(userexist){
                 res.status(422).json({error:"Email already exist"});
            }else if(password!=cpassword){
                return res.status(422).json({error:"password and confirm password should be same"});
            }
    
            const user = new User({name,email,password,cpassword});
            
            await user.save();
                res.status(201).json({message:"user registered successul"});
        }catch(err){
            console.log(err);   
        }
    });

    // Login route
    router.post("/signin", async (req,res)=>{
        try {
           const {email,password}=req.body;
           if(!email || !password){
            return res.status(400).json({error:"please fill the data"});

           }
           const userLogin = await User.findOne({email:email});
           if(userLogin){
            const isMatch = await bcrypt.compare(password,userLogin.password);
            
             const token = await userLogin.generateAuthToken();
             console.log(token);

             res.cookie("jwtoken",token ,{
                expires:new Date(Date.now()+25892000000),
                httpOnly:true
             });

            if(!isMatch){
                res.status(400).json({error:"Invalid Credentials"});
            }
            else{
                res.json({message:"user signin successfully"});
            }
           }
           else{
              res.status(400).json({message:"Invalid credentials"});
           }
          
           


        } catch (error) {
            console.log(error);
        }
    });


    router.get("/typingTutor",authenticate,(req,res)=>{
        console.log("Hello world geeks of typingTutor from server");
        res.send(req.rootUser);
    })

    router.get("/logout",(req,res)=>{
        res.clearCookie("jwtoken",{path:'/'});
        res.status(200).send("User logout successful");
    })

    // Update row and col values
router.patch("/update-row-col", async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["row", "col"];
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );
  
    if (!isValidOperation) {
      return res.status(400).send({ error: "Invalid updates!" });
    }
  
    try {
      const user = await User.findOne();
      updates.forEach((update) => (user[update] = req.body[update]));
      await user.save();
      res.send(user);
    } catch (error) {
      res.status(500).send(error);
    }
  });
  
        
module.exports = router