import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import { User } from "../models/user";
import { BadRequestError, validateRequest } from "@tfg-victor-rosa/common";
import { createChatUser } from "../helpers/chatUser";

const router = express.Router();



router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // 1. Check if the email is already in use
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new BadRequestError("Email allready in use");
    }

    // 2. Create and save the user in the database
    const newUser = new User();
    newUser.email = email;
    newUser.password = password;
    newUser.secret = email;
    const result = await User.save(newUser);

    // 3. Create and save user in chat
    await createChatUser(email);
    

    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: newUser.id,
        email: newUser.email,
      },
      process.env.JWT_KEY!
    );

    // Store JWT on session object
    req.session = {
      jwt: userJwt,
    };

    res.status(201).send(result);
  }
);

export { router as signupRouter };
