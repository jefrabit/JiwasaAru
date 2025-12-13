/*
  # Language Learning App Schema

  ## New Tables
  
  ### `profiles`
  - `id` (uuid, primary key, references auth.users)
  - `username` (text, unique, not null)
  - `lives` (integer, default 5)
  - `level` (integer, default 1)
  - `xp` (integer, default 0)
  - `current_language` (text, default 'spanish')
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())

  ### `lessons`
  - `id` (uuid, primary key)
  - `title` (text, not null)
  - `description` (text)
  - `language` (text, not null)
  - `order_index` (integer, not null)
  - `xp_reward` (integer, default 10)
  - `icon` (text, default 'book')
  - `color` (text, default 'blue')
  - `created_at` (timestamptz, default now())

  ### `user_progress`
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `lesson_id` (uuid, references lessons)
  - `completed` (boolean, default false)
  - `stars` (integer, default 0)
  - `completed_at` (timestamptz)
  - `created_at` (timestamptz, default now())

  ## Security
  - Enable RLS on all tables
  - Users can read their own profile
  - Users can update their own profile
  - Anyone can read lessons (public content)
  - Users can read and manage their own progress
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  lives integer DEFAULT 5 NOT NULL CHECK (lives >= 0 AND lives <= 5),
  level integer DEFAULT 1 NOT NULL CHECK (level >= 1),
  xp integer DEFAULT 0 NOT NULL CHECK (xp >= 0),
  current_language text DEFAULT 'spanish' NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '' NOT NULL,
  language text DEFAULT 'spanish' NOT NULL,
  order_index integer NOT NULL,
  xp_reward integer DEFAULT 10 NOT NULL,
  icon text DEFAULT 'book' NOT NULL,
  color text DEFAULT 'blue' NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create user_progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  lesson_id uuid REFERENCES lessons(id) ON DELETE CASCADE NOT NULL,
  completed boolean DEFAULT false NOT NULL,
  stars integer DEFAULT 0 NOT NULL CHECK (stars >= 0 AND stars <= 3),
  completed_at timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, lesson_id)
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Lessons policies (public read)
CREATE POLICY "Anyone can view lessons"
  ON lessons FOR SELECT
  TO authenticated
  USING (true);

-- User progress policies
CREATE POLICY "Users can view their own progress"
  ON user_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
  ON user_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
  ON user_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Insert sample lessons
INSERT INTO lessons (title, description, language, order_index, xp_reward, icon, color) VALUES
  ('Saludos Básicos', 'Aprende a saludar en español', 'spanish', 1, 10, 'star', 'green'),
  ('Números 1-10', 'Aprende los números del 1 al 10', 'spanish', 2, 10, 'hash', 'blue'),
  ('Colores', 'Aprende los colores principales', 'spanish', 3, 15, 'palette', 'purple'),
  ('Familia', 'Vocabulario sobre la familia', 'spanish', 4, 15, 'users', 'orange'),
  ('Comida', 'Nombres de comidas y bebidas', 'spanish', 5, 20, 'utensils', 'red'),
  ('Animales', 'Aprende nombres de animales', 'spanish', 6, 20, 'dog', 'yellow')
ON CONFLICT DO NOTHING;