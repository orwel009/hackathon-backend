const express=require("express")
const mongoose=require("mongoose")
const cors=require("cors")
const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")
const axios = require("axios")

const app = express()

app.use(cors())
app.use(express.json())


const users = require("./models/user")
const {userModel} = require("./models/user")

// API_KEY = "AIzaSyCYl0i0ZEB3saWZU68ra4HTTVHSeHR5LP4"


mongoose.connect("mongodb+srv://<password>:orwel123@cluster0.hyugd.mongodb.net/hackathon1DB?retryWrites=true&w=majority&appName=Cluster0")

const generateHashedPassword = async(password)=>{
    const salt = await bcryptjs.genSalt(10) //assume the cost of salt
    return bcryptjs.hash(password,salt)  
}

app.post("/signup",async(req,res)=>{
    let input = req.body
    let hashedPassword = await generateHashedPassword(input.password)
    input.password = hashedPassword
    userModel.find({"email":input.email}).then(
        (response)=>{
            if (response.length>0) {
                res.json({"status":"user already exist"})
            } else {
                let user = new users.userModel(input)
                user.save()
                res.json({"status":"success"})
            }
        }
    ).catch(
        (error)=>{
            res.json(error)
        }
    )
})

app.post("/signin", (req, res) => {
    let input = req.body;
    userModel.find({ "email": input.email }).then(
        (response) => {
            if (response.length > 0) {
                let dbpassword = response[0].password;
                bcryptjs.compare(input.password, dbpassword, (error, isMatch) => {
                    if (isMatch) {
                        res.json({ "status": "success", "userId": response[0]._id });
                    } else {
                        res.json({ "status": "Invalid credentials" });
                    }
                });
            } else {
                res.json({ "status": "user not found" });
            }
        }
    ).catch(
        (error) => {
            res.json(error);
        }
    );
});




const PORT = 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});