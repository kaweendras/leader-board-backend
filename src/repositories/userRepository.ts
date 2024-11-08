import { IUser } from "../models/userModel";
import User from "../models/userModel";

const getAllUsers = async () => {
  try {
    const users = await User.find({ role: "player" });
    return users;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to fetch users from the database");
  }
};

const findUserByEmail = async (email: string) => {
  try {
    const user = await User.findOne({
      email,
    });
    return user;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to fetch user from the database");
  }
};

const addUser = async (userData: IUser) => {
  try {
    const user = new User({
      ...userData,
    });
    await user.save();
    return user;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to add user to the database");
  }
};

const updatePointsByEmail = async (email: string, points: number) => {
  try {
    const user = await User.findOneAndUpdate(
      { email },
      { points },
      { new: true }
    );
    return user;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to update user points in the database");
  }
};

export { getAllUsers, findUserByEmail, addUser, updatePointsByEmail };
