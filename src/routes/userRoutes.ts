import express from "express";
const router = express.Router();
import * as userController from "../controllers/userControllers";
import { authMiddleware } from "../middleware/authMiddleware";

/**
 * GET api/v1/users/getall
 * Get all users
 */
router.get("/users/getall", userController.getAllUsersController);

/**
 * POST api/v1/users/create
 * Add a new user
 */
router.post(
  "/users/create",
  // authMiddleware,
  userController.createUsersController
);

/**
 * POST api/v1/users/login
 * Login user
 */
router.post("/users/login", userController.loginUserController);

/**
 * GET api/v1/users/profile
 * Get user profile
 */
router.get(
  "/users/profile",
  authMiddleware,
  userController.getProfileController
);

export default router;
