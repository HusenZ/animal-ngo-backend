import express from 'express';

import { 
  createRescueCase, 
  getNearbyRescueCases, 
  assignVolunteer, 
  updateRescueStatus 
} from '../controllers/rescueControllers.js';

import { 
  validateRescueCase, 
  validateNearbyQuery, 
  validateStatusUpdate 
} from '../middlewares/validation.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();


// POST /api/rescue → Create rescue case
router.post('/', validateRescueCase, createRescueCase);

// GET /api/rescue/nearby → Rescue cases near you (volunteers)
router.post('/nearby', verifyToken,  getNearbyRescueCases);

// PUT /api/rescue/:id/assign → Assign volunteer
router.put('/:id/assign', assignVolunteer);

// PUT /api/rescue/:id/status → Update status
router.put('/:id/status', validateStatusUpdate, updateRescueStatus);

export default router;