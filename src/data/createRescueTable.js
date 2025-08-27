import pool from '../config/db.js';

export const createRescueTable = async () => {
  try {
    // 1. Create the enum type if not exists
    const enumExistsQuery = `
      SELECT 1 FROM pg_type WHERE typname = 'rescue_status';
    `;
    const enumExistsResult = await pool.query(enumExistsQuery);

    if (enumExistsResult.rowCount === 0) {
      await pool.query(`CREATE TYPE rescue_status AS ENUM ('pending', 'assigned', 'resolved');`);
      console.log('Rescue status enum created');
    } else {
      console.log('Rescue status enum already exists');
    }

    // 2. Create the table if not exists
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS rescues (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        image_url VARCHAR(500),
        location GEOMETRY(Point, 4326) NOT NULL,
        reporter_user_id INTEGER NOT NULL REFERENCES users(id),
        assigned_volunteer_id INTEGER REFERENCES users(id),
        status rescue_status DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;

    await pool.query(createTableQuery);
    console.log('Rescue cases table created or already exists');

    // 3. Create indexes individually if not exist
    const indexQueries = [
      `CREATE INDEX IF NOT EXISTS rescue_cases_location_idx ON rescue_cases USING GIST (location);`,
      `CREATE INDEX IF NOT EXISTS rescue_cases_status_idx ON rescue_cases (status);`,
      `CREATE INDEX IF NOT EXISTS rescue_cases_created_at_idx ON rescue_cases (created_at);`,
      `CREATE INDEX IF NOT EXISTS rescue_cases_reporter_status_idx ON rescue_cases (reporter_user_id, status);`,
      `CREATE INDEX IF NOT EXISTS rescue_cases_volunteer_status_idx ON rescue_cases (assigned_volunteer_id, status);`,
    ];

    for (const query of indexQueries) {
      await pool.query(query);
    }

    console.log('Rescue cases indexes created or already exist');

  } catch (err) {
    console.error('Error creating rescue cases table and indexes:', err);
    throw err;
  }
};
