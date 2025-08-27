import pool from '../config/db.js';

// Create a new rescue case
export const createRescueCase = async (req, res, next) => {
  try {
    const { title, description, image_url, latitude, longitude, reporter_user_id } = req.body;

    if (!title || !description || latitude == null || longitude == null || !reporter_user_id) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, latitude, longitude, and reporter_user_id are required'
      });
    }

    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return res.status(400).json({ success: false, message: 'Invalid coordinates' });
    }

    const insertQuery = `
      INSERT INTO rescues (title, description, image_url, location, reporter_user_id)
      VALUES ($1, $2, $3, ST_SetSRID(ST_MakePoint($4, $5), 4326), $6)
      RETURNING 
        id, title, description, image_url, reporter_user_id,
        assigned_volunteer_id, status, created_at,
        ST_X(location) as longitude, ST_Y(location) as latitude
    `;

    const values = [
      title.trim(),
      description.trim(),
      image_url?.trim() || null,
      longitude,
      latitude,
      reporter_user_id
    ];

    const { rows } = await pool.query(insertQuery, values);

    const reporterQuery = `SELECT id, name, email, phone_number FROM users WHERE id = $1`;
    const reporterResult = await pool.query(reporterQuery, [reporter_user_id]);

    return res.status(201).json({
      success: true,
      message: 'Rescue case created successfully',
      data: {
        ...rows[0],
        reporter: reporterResult.rows[0] || null
      }
    });

  } catch (error) {
    console.error('Create rescue case error:', error);

    if (error.code === '23505') {
      return res.status(409).json({ success: false, message: 'Duplicate entry' });
    }
    if (error.code === '23503') {
      return res.status(400).json({ success: false, message: 'Invalid user reference' });
    }

    return res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: error.message
    });
  }
};

// Get nearby rescue cases (for volunteers)
export const getNearbyRescueCases = async (req, res) => {
  try {
    const { latitude, longitude, radius } = req.body;

    console.log("REQ BODY:", req.body);


    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude are required",
      });
    }

    const searchRadius = radius || 5000; // default 5km

    // Example PostGIS query (if using PostgreSQL + PostGIS)
    const query = `
      SELECT *, ST_Distance(location, ST_SetSRID(ST_MakePoint($1, $2), 4326)) as distance
      FROM rescues
      WHERE ST_DWithin(location, ST_SetSRID(ST_MakePoint($1, $2), 4326), $3)
      ORDER BY distance ASC;
    `;

    const result = await pool.query(query, [longitude, latitude, searchRadius]);

    res.json({
      success: true,
      count: result.rows.length,
      rescues: result.rows,
    });
  } catch (error) {
    console.error("Error fetching nearby rescues:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};


// Assign a volunteer to a case
export const assignVolunteer = async (req, res, next) => {
  try {
    const caseId = req.params.id;
    const volunteer_id = req.user.id;

    // Check if case exists and is not already assigned
    const checkQuery = `SELECT * FROM rescue_cases WHERE id = $1`;
    const caseResult = await pool.query(checkQuery, [caseId]);

    if (caseResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Rescue case not found' });
    }

    const rescueCase = caseResult.rows[0];

    if (rescueCase.assigned_volunteer_id) {
      return res.status(400).json({ success: false, message: 'Rescue case already assigned' });
    }

    if (rescueCase.reporter_user_id === volunteer_id) {
      return res.status(403).json({ success: false, message: 'You cannot take your own case' });
    }

    const assignQuery = `
      UPDATE rescue_cases
      SET assigned_volunteer_id = $1, status = 'assigned'
      WHERE id = $2
      RETURNING *
    `;
    const { rows } = await pool.query(assignQuery, [volunteer_id, caseId]);

    return res.status(200).json({
      success: true,
      message: 'Rescue case assigned to volunteer',
      data: rows[0]
    });

  } catch (error) {
    console.error('Assign volunteer error:', error);
    next(error);
  }
};

// Update rescue case status
export const updateRescueStatus = async (req, res, next) => {
  try {
    const caseId = req.params.id;
    const { status } = req.body;
    const user_id = req.user.id;

    if (!['assigned', 'rescued', 'cancelled'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const checkQuery = `SELECT * FROM rescue_cases WHERE id = $1`;
    const result = await pool.query(checkQuery, [caseId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Rescue case not found' });
    }

    const rescueCase = result.rows[0];

    if (rescueCase.assigned_volunteer_id !== user_id) {
      return res.status(403).json({ success: false, message: 'You are not assigned to this case' });
    }

    const updateQuery = `
      UPDATE rescue_cases
      SET status = $1
      WHERE id = $2
      RETURNING *
    `;

    const updateResult = await pool.query(updateQuery, [status, caseId]);

    return res.status(200).json({
      success: true,
      message: `Rescue case status updated to ${status}`,
      data: updateResult.rows[0]
    });

  } catch (error) {
    console.error('Update status error:', error);
    next(error);
  }
};
