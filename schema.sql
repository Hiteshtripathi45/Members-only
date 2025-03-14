-- Drop existing tables (optional, use with caution)
DROP TABLE IF EXISTS messagetable;
DROP TABLE IF EXISTS member_user;

-- Create the member_user table
CREATE TABLE member_user (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  joined BOOLEAN DEFAULT FALSE
);

-- Create the messagetable table
CREATE TABLE messagetable (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES member_user(id) ON DELETE CASCADE
);