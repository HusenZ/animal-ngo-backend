import express from 'express';
import { registerUser, loginUser, logoutUser, getAllUsers, getUserById, updateUser, deleteUser, setUserLocation, getNearbyUsers} from '../controllers/userController.js';
// import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

router.get("/:id", getUserById);

router.put("/:id", updateUser);

router.put('/location/:id', setUserLocation);
router.get('/nearby', getNearbyUsers);

//admin routes
router.delete("/:id", deleteUser);

router.get("/", getAllUsers);



/*
------------WILL DO IT LATER-------------
router.get('/profile', protect, (req, res) => {
    res.json({ message: `Welcome user ${req.user.id}`, user: req.user });
});
*/

export default router;