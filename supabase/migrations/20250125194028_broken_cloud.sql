/*
  # Gallery Database Schema

  1. New Tables
    - `paintings`
      - `id` (uuid, primary key)
      - `title` (text)
      - `artist` (text)
      - `description` (text)
      - `price` (numeric)
      - `dimensions` (text)
      - `medium` (text)
      - `year` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `painting_images`
      - `id` (uuid, primary key)
      - `painting_id` (uuid, foreign key)
      - `url` (text)
      - `order` (integer)
      - `created_at` (timestamp)
    
    - `painting_reports`
      - `id` (uuid, primary key)
      - `painting_id` (uuid, foreign key)
      - `url` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Policies for authenticated users to manage content
    - Public read access for gallery visitors
*/

-- Create paintings table
CREATE TABLE paintings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  artist text NOT NULL,
  description text NOT NULL,
  price numeric NOT NULL,
  dimensions text NOT NULL,
  medium text NOT NULL,
  year text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create painting_images table
CREATE TABLE painting_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  painting_id uuid REFERENCES paintings(id) ON DELETE CASCADE,
  url text NOT NULL,
  "order" integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create painting_reports table
CREATE TABLE painting_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  painting_id uuid REFERENCES paintings(id) ON DELETE CASCADE,
  url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE paintings ENABLE ROW LEVEL SECURITY;
ALTER TABLE painting_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE painting_reports ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (read-only)
CREATE POLICY "Public can view paintings" 
  ON paintings
  FOR SELECT 
  TO public 
  USING (true);

CREATE POLICY "Public can view painting images" 
  ON painting_images
  FOR SELECT 
  TO public 
  USING (true);

CREATE POLICY "Public can view painting reports" 
  ON painting_reports
  FOR SELECT 
  TO public 
  USING (true);

-- Create policies for authenticated users (full access)
CREATE POLICY "Authenticated users can manage paintings" 
  ON paintings
  FOR ALL 
  TO authenticated 
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage painting images" 
  ON painting_images
  FOR ALL 
  TO authenticated 
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage painting reports" 
  ON painting_reports
  FOR ALL 
  TO authenticated 
  USING (true)
  WITH CHECK (true);