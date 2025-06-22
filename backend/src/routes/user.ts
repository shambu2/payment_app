import express, { Request, Response } from "express";
const router = express.Router();
import zod from "zod";
import { Account, User } from "../models/db";
import bcrypt from "bcrypt";
// import { Jwt } from 'jsonwebtoken';
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import authMiddleware from "../middlewares/authMiddleware";

const signupBody = zod.object({
  username: zod.string().email(),
  firstName: zod.string(),
  lastName: zod.string(),
  password: zod.string(),
});
const signinBody = zod.object({
  username: zod.string().email(),
  password: zod.string(),
});
const updateBody = zod.object({
  password: zod.string().optional(),
  firstName: zod.string().optional(),
  lastName: zod.string().optional(),
});

router.post("/signup", async (req: Request, res: Response) => {
  // const {username,firstName,lastName,password} = req.body;
  const { success } = signupBody.safeParse(req.body);
  const { password } = req.body;

  const hashedPassword = bcrypt.hashSync(password, 10);

  try {
    if (!success) {
      res.status(411).json({
        message: "Email already taken or incorrect inputs",
      });
      return;
    }
    const existingUser = await User.findOne({
      username: req.body.username,
    });
    if(existingUser){
        res.status(411).json({
            message:"Email already taken/incorrect inputs"
        })
        return;
    }


    const user = await User.create({
      username: req.body.username,
      password: hashedPassword,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    });
    // await user.save();
    const userId = user._id;
    await Account.create({
        userId,
        balance: 10 + Math.floor(Math.random()*10000)
    })


    const token = jwt.sign(
      {
        userId,
      },
      JWT_SECRET
    );

    res.json({
      message: "User crated successfully",
      token,
    });
    return;
  } catch (error) {
    res.status(500).json({ message: "Unable to create user" });
    return;
  }
});
router.post("/signin", async (req: Request, res: Response) => {
  const { success } = signinBody.safeParse(req.body);
  try {
    if (!success) {
      res.status(411).json({
        message: "Incorrect inputs",
      });
      return;
    }
    const user = await User.findOne({
      username: req.body.username,
    });
    const passwordVerified = bcrypt.compareSync(req.body.password, user?.password as string);
    if (!passwordVerified) {
      res.status(401).json({
        message: "Enter correct message",
      });
      return;
    }
    if (passwordVerified) {
      const token = jwt.sign(
        {
          userId: user?._id,
        },
        JWT_SECRET
      );

      res.json({
        message: "Logged in correctly",
        token: token,
      });
      return;
    }
  } catch (error) {
    res.status(411).json({
      message: "Error while login",
    });
  }
});

router.put("/", authMiddleware, async (req: Request, res: Response) => {
  const { success } = updateBody.safeParse(req.body);
  try {
    if (!success) {
      res.status(411).json({
        message: "Error while updating information",
      });
      return;
    }
    await User.updateOne({ _id: req.userId }, req.body);
    res.status(200).json({
      message: "Updated successfully",
    });
    return;
  } catch (error) {
    res.status(500).json({ message: "Unable to update" });
    return;
  }
});

router.get("/bulk", async(req: Request, res: Response) => {
  try {
    const filter = (req.query.filter as string) || "";
    const users = await User.find({
        $or:[
            {firstName: {$regex: filter, $options: 'i'}},
            {lastName: {$regex: filter,$options: 'i'}}
        ]
    });

    const result = users.map(user => ({
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        _id: user._id
    }));

    res.json({user: result})
    return;
  } catch (error) {
    res.status(500).json({message: 'Internal server error'})
    return;
  }
});

export default router;
