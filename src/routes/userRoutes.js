import experss from "express";
import { getAllUsers, registerUser, updateUser,getUserById } from "../controllers/userController.js";

const router = experss.Router();

// router.post("/login", );
router.post("/register", registerUser)
// router.post("/logout", logoutUser);
router.post("/user/update", updateUser);
router.get("/user", getAllUsers);
router.get("/user/:id", getUserById);

export default router;