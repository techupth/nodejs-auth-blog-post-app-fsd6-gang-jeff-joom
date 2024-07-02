import { Router } from "express";
import { db } from "../utils/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const authRouter = Router();

authRouter.post("/register", async (req, res)=> {
    authRouter.post("/register", async (req, res) => {
        const user = {
          username: req.body.username,
          password: req.body.password,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
        };
      
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        const collection = db.collection("users");
      
        try {
          await collection.insertOne(user);
        } catch {
          return res.status(500).json({
            message: "cannot register due to some problems.",
          });
        }
      
        return res.status(200).json({
          message: "User has been created successfully",
        });
      });
}) 

authRouter.get("/login", async (req,res) => {
    const user = await db.collection("Users").findOne({
        username: req.body.username,
    });

    if (!user) {
        return res.status(404).json({
            message: "user not found"
        })
    };

    const isValidPassword = await bcrypt.compare(
        req.body.password,
        user.password
    );

    if(!isValidPassword){
        return res.status(400).json({
            message: "Invalid username or password",
        });
    }

    const token = jwt.sign(
        {id: user._id, firstName: user.firstName, lastName: user.lastName},
        process.env.SECRET_KEY,
        {
            expiresIn: "90000",
        }
    );
    
    return res.json({
        message: "login successfully",
        token,
    })
})

export default authRouter;
