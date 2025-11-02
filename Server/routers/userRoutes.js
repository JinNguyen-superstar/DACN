import { Router } from "express";
import {
    registerUser,
    activateAdmin,
    loginUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
} from "../controllers/userController.js";

const router = Router();

// Register (create) user
router.post("/register", registerUser);

// Activate admin (requires key)
router.post("/activate-admin", activateAdmin);

// Login
router.post("/login", loginUser);

// CRUD
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
