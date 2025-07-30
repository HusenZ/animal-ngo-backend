export const validateRescueCase = (req, res, next) => {
    const { title, description, latitude, longitude } = req.body;
    const errors = [];
  
    // Validate title
    if (!title || typeof title !== 'string') {
      errors.push({ field: 'title', message: 'Title is required and must be a string' });
    } else if (title.trim().length < 3 || title.trim().length > 255) {
      errors.push({ field: 'title', message: 'Title must be between 3 and 255 characters' });
    }
  
    // Validate description
    if (!description || typeof description !== 'string') {
      errors.push({ field: 'description', message: 'Description is required and must be a string' });
    } else if (description.trim().length < 10 || description.trim().length > 2000) {
      errors.push({ field: 'description', message: 'Description must be between 10 and 2000 characters' });
    }
  
    // Validate coordinates
    if (latitude === undefined || latitude === null) {
      errors.push({ field: 'latitude', message: 'Latitude is required' });
    } else if (isNaN(latitude) || latitude < -90 || latitude > 90) {
      errors.push({ field: 'latitude', message: 'Latitude must be between -90 and 90' });
    }
  
    if (longitude === undefined || longitude === null) {
      errors.push({ field: 'longitude', message: 'Longitude is required' });
    } else if (isNaN(longitude) || longitude < -180 || longitude > 180) {
      errors.push({ field: 'longitude', message: 'Longitude must be between -180 and 180' });
    }
  
    // Validate image_url if provided
    if (req.body.image_url && typeof req.body.image_url === 'string') {
      const urlPattern = /^https?:\/\/.+/;
      if (!urlPattern.test(req.body.image_url)) {
        errors.push({ field: 'image_url', message: 'Image URL must be a valid HTTP/HTTPS URL' });
      }
    }
  
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }
  
    next();
  };
  
  export const validateNearbyQuery = (req, res, next) => {
    const { latitude, longitude, radius, status, limit, offset } = req.query;
    const errors = [];
  
    // Validate coordinates
    if (!latitude) {
      errors.push({ field: 'latitude', message: 'Latitude is required' });
    } else if (isNaN(latitude) || parseFloat(latitude) < -90 || parseFloat(latitude) > 90) {
      errors.push({ field: 'latitude', message: 'Latitude must be between -90 and 90' });
    }
  
    if (!longitude) {
      errors.push({ field: 'longitude', message: 'Longitude is required' });
    } else if (isNaN(longitude) || parseFloat(longitude) < -180 || parseFloat(longitude) > 180) {
      errors.push({ field: 'longitude', message: 'Longitude must be between -180 and 180' });
    }
  
    // Validate optional parameters
    if (radius && (isNaN(radius) || parseInt(radius) < 100 || parseInt(radius) > 100000)) {
      errors.push({ field: 'radius', message: 'Radius must be between 100 and 100000 meters' });
    }
  
    if (status && !['pending', 'assigned', 'resolved', 'all'].includes(status)) {
      errors.push({ field: 'status', message: 'Status must be pending, assigned, resolved, or all' });
    }
  
    if (limit && (isNaN(limit) || parseInt(limit) < 1 || parseInt(limit) > 100)) {
      errors.push({ field: 'limit', message: 'Limit must be between 1 and 100' });
    }
  
    if (offset && (isNaN(offset) || parseInt(offset) < 0)) {
      errors.push({ field: 'offset', message: 'Offset must be 0 or greater' });
    }
  
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }
  
    next();
  };
  
  export const validateStatusUpdate = (req, res, next) => {
    const { status } = req.body;
    const { id } = req.params;
    const errors = [];
  
    // Validate UUID format for id
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidPattern.test(id)) {
      errors.push({ field: 'id', message: 'Invalid rescue case ID format' });
    }
  
    // Validate status
    if (!status) {
      errors.push({ field: 'status', message: 'Status is required' });
    } else if (!['pending', 'assigned', 'resolved'].includes(status)) {
      errors.push({ field: 'status', message: 'Status must be pending, assigned, or resolved' });
    }
  
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }
  
    next();
  };