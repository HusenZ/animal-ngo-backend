import {
    createDonationRequest,
    getAllDonationRequests,
    getDonationById,
    updateDonationStatus,
    deleteDonation
  } from "../models/donationModel.js";
  
  export const createDonation = async (req, res) => {
    try {
      const { title, description } = req.body;
      const user_id = req.body.user_id || req.user?.id;
  
      const donation = await createDonationRequest({ user_id, title, description });
      res.status(201).json({ message: "Donation request created", data: donation });
    } catch (error) {
      res.status(500).json({ message: "Something went wrong", error: error.message });
    }
  };
  
  export const getAllDonations = async (req, res) => {
    try {
      const donations = await getAllDonationRequests();
      res.status(200).json({ data: donations });
    } catch (error) {
      res.status(500).json({ message: "Error fetching donations", error: error.message });
    }
  };
  
  export const getDonation = async (req, res) => {
    try {
      const { id } = req.params;
      const donation = await getDonationById(id);
      if (!donation) return res.status(404).json({ message: "Donation not found" });
      res.status(200).json({ data: donation });
    } catch (error) {
      res.status(500).json({ message: "Error", error: error.message });
    }
  };
  
  export const updateDonation = async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const updated = await updateDonationStatus(id, status);
      res.status(200).json({ message: "Status updated", data: updated });
    } catch (error) {
      res.status(500).json({ message: "Error", error: error.message });
    }
  };
  
  export const deleteDonationRequest = async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await deleteDonation(id);
      res.status(200).json({ message: "Deleted successfully", data: deleted });
    } catch (error) {
      res.status(500).json({ message: "Error", error: error.message });
    }
  };
  