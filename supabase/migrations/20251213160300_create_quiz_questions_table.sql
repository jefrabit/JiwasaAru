/*
  # Create Quiz Questions Table

  1. New Tables
    - `quiz_questions`
      - `id` (uuid, primary key)
      - `question` (text, the quiz question)
      - `option_a` (text, first option)
      - `option_b` (text, second option)
      - `option_c` (text, third option)
      - `correct_answer` (text, 'A', 'B', or 'C')
      - `difficulty` (text, 'easy', 'medium', 'hard')
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on quiz_questions
    - Authenticated users can read all questions (public educational content)
*/

CREATE TABLE IF NOT EXISTS quiz_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  option_a text NOT NULL,
  option_b text NOT NULL,
  option_c text NOT NULL,
  correct_answer text NOT NULL CHECK (correct_answer IN ('A', 'B', 'C')),
  difficulty text DEFAULT 'easy' NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view quiz questions"
  ON quiz_questions FOR SELECT
  TO authenticated
  USING (true);

INSERT INTO quiz_questions (question, option_a, option_b, option_c, correct_answer, difficulty) VALUES
  ('¿Cuál es el capital de España?', 'Barcelona', 'Madrid', 'Valencia', 'B', 'easy'),
  ('¿Cuántos continentes hay?', 'Seis', 'Siete', 'Cinco', 'B', 'easy'),
  ('¿Cuál es el planeta más grande del sistema solar?', 'Saturno', 'Neptuno', 'Júpiter', 'C', 'easy'),
  ('¿En qué año cayó el Muro de Berlín?', '1989', '1991', '1985', 'A', 'medium'),
  ('¿Cuál es el océano más grande?', 'Atlántico', 'Índico', 'Pacífico', 'C', 'medium'),
  ('¿Cuántos lados tiene un hexágono?', 'Cinco', 'Seis', 'Siete', 'B', 'easy'),
  ('¿Cuál es la montaña más alta del mundo?', 'Kilimanjaro', 'Monte Everest', 'Elbrus', 'B', 'medium'),
  ('¿En qué país están las Cataratas del Niágara?', 'México', 'Canadá y USA', 'Brasil', 'B', 'medium'),
  ('¿Cuántas provincias tiene Argentina?', '24', '25', '26', 'A', 'medium'),
  ('¿Cuál es el río más largo de América?', 'Río Grande', 'Amazonas', 'Misisipi', 'B', 'medium'),
  ('¿En qué año comenzó la Segunda Guerra Mundial?', '1938', '1939', '1940', 'B', 'medium'),
  ('¿Cuál es la capital de Francia?', 'Lyon', 'París', 'Marsella', 'B', 'easy'),
  ('¿Cuántos colores tiene el arcoíris?', 'Cinco', 'Seis', 'Siete', 'C', 'easy'),
  ('¿Cuál es el idioma más hablado del mundo?', 'Español', 'Inglés', 'Chino mandarín', 'C', 'medium'),
  ('¿En qué continente está Egipto?', 'Asia', 'Europa', 'África', 'C', 'easy'),
  ('¿Cuál es el animal más rápido del mundo?', 'Gacela', 'Halcón peregrino', 'Guepardo', 'B', 'medium'),
  ('¿Cuántas cuerdas tiene una guitarra clásica?', 'Cinco', 'Seis', 'Siete', 'B', 'easy'),
  ('¿En qué año se descubrió América?', '1492', '1500', '1505', 'A', 'easy'),
  ('¿Cuál es el gas más abundante en la atmósfera?', 'Oxígeno', 'Nitrógeno', 'Dióxido de carbono', 'B', 'medium'),
  ('¿Cuántos huesos tiene el cuerpo humano?', '196', '206', '216', 'B', 'medium')
ON CONFLICT DO NOTHING;