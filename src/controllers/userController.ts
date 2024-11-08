import { Request, Response, NextFunction } from "express";

import { getAllUsers, createUser, loginUser } from "../services/userServices";

import { verifyToken } from "../utils/authUtils";

const getAllUsersController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let users;
  try {
    users = await getAllUsers();

    if (!users) {
      return res
        .status(500)
        .json({ success: "false", data: [], message: "No users found" });
    }
    res.status(200).json({ success: "true", data: users.data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: "false",
      message: "Failed to retrieve users",
      data: [],
    });
  }
};

const createUsersController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userData = req.body;
  let user;
  try {
    user = await createUser(userData);
    if (user && user.success === "false") {
      return res
        .status(500)
        .json({ success: "false", data: [], message: user.message });
    }
    res.status(201).json({ success: "true", data: user?.data });
  } catch (err) {
    console.error(err);
  }
};

const loginUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  let user;
  try {
    user = await loginUser(email, password);

    if (user && user.success === "false") {
      return res
        .status(500)
        .json({ success: "false", data: [], message: user.message });
    }
    res
      .status(200)
      .json({ success: "true", token: user?.token, role: user?.role });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: "false",
      message: "Failed to login",
      data: [],
    });
  }
};
