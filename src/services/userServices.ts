import * as userRepository from "../repositories/usersRepository";
import { IUser } from "../models/userModel";
import bcrypt from "bcrypt";
import User from "../models/userModel";
import * as dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const saltRounds = 10;
const jwtSecret = process.env.JWT_SECRET as string;

const getAllUsers = async () => {
  try {
    const user = await userRepository.getAllUsers();
    return { data: user };
  } catch (err) {
    console.error(err);
    return { message: "Failed to get users" };
  }
};

const createUser = async (userData: IUser) => {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
    // Create a new user with the hashed password
    const user = new User({
      ...userData,
      password: hashedPassword,
    });

    // Check if the user already exists
    const existing = await userRepository.getUserByEmail(user.email);
    if (existing) {
      console.log(`User already exists for the email ${user.email}`);
      return { success: "false", message: "User already exists" };
    }

    // Save the user to the database
    await user.save();
    console.log(`User added successfully: ${user.email}`);
    return { success: "true", data: user, message: "User added successfully" };
  } catch (err) {
    console.error("Failed to add user", err);
    return { success: "false", message: "Failed to add user" };
  }
};

const loginUser = async (email: string, password: string) => {
  try {
    // Find the user by email
    const user = await userRepository.getUserByEmail(email);
    if (!user) {
      console.log(`User not found for the email ${email}`);
      return { success: "false", message: "User not found" };
    }

    // Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log(`Invalid password for the email ${email}`);
      return { success: "false", message: "Invalid password" };
    }

    // Generate a JWT
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        points: user.points,
      },
      jwtSecret,
      {
        expiresIn: "24h",
      }
    );

    console.log(`User logged in successfully: ${user.email}`);

    return {
      success: "true",
      token,
      role: user.role,
      message: "Login successful",
    };
  } catch (err) {
    console.error(`Failed to login with: ${err}`);
    console.error(err);
    return { success: "false", message: "Login failed" };
  }
};

export { getAllUsers, createUser, loginUser };
