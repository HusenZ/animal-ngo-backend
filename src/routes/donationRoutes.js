import express from "express";
import {
  createDonation,
  getAllDonations,
  getDonation,
  updateDonation,
  deleteDonationRequest
} from "../controllers/donationController.js";

const router = express.Router();

router.post("/", createDonation); // Create donation request
router.get("/", getAllDonations); // Get all
router.get("/:id", getDonation); // Get one
router.patch("/:id", updateDonation); // Update status
router.delete("/:id", deleteDonationRequest); // Delete

export default router;
