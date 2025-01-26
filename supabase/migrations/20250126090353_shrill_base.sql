/*
  # Database Schema for Art Gallery

  1. Tables
    - paintings: Main table for artwork information
    - painting_images: Images associated with paintings
    - painting_reports: PDF reports for paintings

  2. Relationships
    - One-to-many between paintings and painting_images
    - One-to-many between paintings and painting_reports

  3. Security
    - RLS enabled on all tables
    - Public read access
    - Authenticated users have full access
*/

-- Create paintings table
CREATE TABLE IF NOT EXISTS paintings (
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

-- Create painting_images table with proper foreign key
CREATE TABLE IF NOT EXISTS painting_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  painting_id uuid NOT NULL,
  url text NOT NULL,
  "order" integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  FOREIGN KEY (painting_id) REFERENCES paintings(id) ON DELETE CASCADE
);

-- Create painting_reports table with proper foreign key
CREATE TABLE IF NOT EXISTS painting_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  painting_id uuid NOT NULL,
  url text NOT NULL,
  created_at timestamptz DEFAULT now(),
  FOREIGN KEY (painting_id) REFERENCES paintings(id) ON DELETE CASCADE
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

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_painting_images_painting_id ON painting_images(painting_id);
CREATE INDEX IF NOT EXISTS idx_painting_reports_painting_id ON painting_reports(painting_id);