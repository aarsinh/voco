import Volunteer from "../models/volunteer.model";
import NGO from "../models/ngo.model";
import { Request, Response } from 'express';
import bcrypt from 'bcrypt'
import { Model } from "mongoose";
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

interface AuthUser {
  username: string,
  password: string
}

export const RegisterVolunteer = async (req: Request, res: Response) => {
  try {
    const { username, password, name, email, phoneNumber, age, sex } = req.body;
    const existingUser = await Volunteer.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    await Volunteer.create({ username, password, name, email, phoneNumber, age, sex });
    res.status(201).json({
      message: "Successful volunteer sign up"
    });
  } catch (err) {
    console.error(`server error: ${err}`)
    res.status(500).json({
      message: `Server error for volunteer register: ${err}`
    });
  }
}

export const RegisterNGO = async (req: Request, res: Response) => {
  try {
    const { username, password, name, email, phoneNumber, website } = req.body;
    const existing = await NGO.findOne({ username });
    if (existing) {
      res.status(400).json({
        message: "Username already exists"
      });
    }

    await NGO.create({ username, password, name, email, phoneNumber, website });
    res.status(201).json({
      message: "Successful NGO sign up"
    });
  } catch (err) {
    console.error(err)
    res.status(500).json({
      message: `Server error: ${err}`
    });
  }
}

export const Login = async (req: Request, res: Response) => {
  try {
    const { username, password, role } = req.body;
    if (!username || !password || !role) {
      res.status(400).json({
        message: "Fields are missing"
      })
    }

    const Model: Model<AuthUser> = role === "volunteer" ? Volunteer : NGO;
    const user = await Model.findOne({ username });
    if (!user) {
      console.log("user not found in db")
      return res.status(401).json({
        message: "Invalid user credentials:"
      });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      console.log("wrong password")
      return res.status(401).json({
        message: "Invalid user credentials"
      });
    }

    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET as string, {
      expiresIn: 24 * 60 * 60 * 3, // 3 day expiry
    });

    res.cookie("token", token,
      {
        httpOnly: true,
      }
    );

    res.status(200).json({
      role: role,
      id: user._id,
      name: user.username
    });

    console.log("successfully signed in")
  } catch (err) {
    console.log(`server error: ${err}`)
    res.status(500).json({
      message: "Server error"
    })
  }
}

export const ValidateToken = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ ok: false });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string; role: string };
    return res.status(200).json({ ok: true, id: decoded.id, role: decoded.role });
  } catch {
    return res.status(401).json({ ok: false });
  }
}

export const Logout = async (_req: Request, res: Response) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
}
