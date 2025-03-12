import { Router } from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserDetails,
} from "../controllers/user.controller";

const router: Router = Router();

router.post("/createUser", createUser as any);
router.get("/getUsers", getAllUsers);
router.get("/getUser/:id", getUserById as any);
router.put("/updateUser/:id", updateUser);
router.delete("/deleteUser/:id", deleteUser);

router.get("", getUserDetails);

export default router;
