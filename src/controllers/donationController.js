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
    
    // Validate required fields
    if (!title || !description) {
      return res.status(400).json({ 
        message: "Title and description are required" 
      });
    }

    // Get user_id from authenticated user or request body (for testing)
    const user_id = req.user?.id || req.body.user_id || 1; // Default to 1 for testing

    const donation = await createDonationRequest({ 
      user_id, 
      title: title.trim(), 
      description: description.trim() 
    });
    
    res.status(201).json({ 
      message: "Donation request created successfully", 
      data: donation 
    });
  } catch (error) {
    console.error('Create donation error:', error);
    res.status(500).json({ 
      message: "Failed to create donation request", 
      error: error.message 
    });
  }
};

export const getAllDonations = async (req, res) => {
  try {
    const donations = await getAllDonationRequests();
    res.status(200).json({ 
      data: donations || [],
      count: donations ? donations.length : 0
    });
  } catch (error) {
    console.error('Get all donations error:', error);
    res.status(500).json({ 
      message: "Error fetching donations", 
      error: error.message 
    });
  }
};

export const getDonation = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Invalid donation ID" });
    }

    const donation = await getDonationById(parseInt(id));
    
    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }
    
    res.status(200).json({ data: donation });
  } catch (error) {
    console.error('Get donation error:', error);
    res.status(500).json({ 
      message: "Error fetching donation", 
      error: error.message 
    });
  }
};

export const updateDonation = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Invalid donation ID" });
    }

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    // Validate status values
    const validStatuses = ['pending', 'active', 'fulfilled', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: "Invalid status. Must be one of: " + validStatuses.join(', ')
      });
    }

    const updated = await updateDonationStatus(parseInt(id), status);
    
    if (!updated) {
      return res.status(404).json({ message: "Donation not found" });
    }
    
    res.status(200).json({ 
      message: "Donation status updated successfully", 
      data: updated 
    });
  } catch (error) {
    console.error('Update donation error:', error);
    res.status(500).json({ 
      message: "Error updating donation status", 
      error: error.message 
    });
  }
};

export const deleteDonationRequest = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Invalid donation ID" });
    }

    const deleted = await deleteDonation(parseInt(id));
    
    if (!deleted) {
      return res.status(404).json({ message: "Donation not found" });
    }
    
    res.status(200).json({ 
      message: "Donation request deleted successfully", 
      data: deleted 
    });
  } catch (error) {
    console.error('Delete donation error:', error);
    res.status(500).json({ 
      message: "Error deleting donation request", 
      error: error.message 
    });
  }
};