-- Create surveys table
CREATE TABLE surveys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  application_id UUID REFERENCES applications(id) ON DELETE SET NULL,
  company TEXT NOT NULL,
  position TEXT,
  survey_type TEXT NOT NULL DEFAULT 'Post-Interview',
  survey_url TEXT,
  status TEXT NOT NULL DEFAULT 'Pending',
  priority TEXT NOT NULL DEFAULT 'Medium',
  due_date DATE,
  requested_date DATE,
  completed_date DATE,
  requester_name TEXT,
  requester_email TEXT,
  description TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own surveys"
  ON surveys FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own surveys"
  ON surveys FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own surveys"
  ON surveys FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own surveys"
  ON surveys FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for better query performance
CREATE INDEX surveys_user_id_idx ON surveys(user_id);
CREATE INDEX surveys_status_idx ON surveys(status);
CREATE INDEX surveys_due_date_idx ON surveys(due_date);
CREATE INDEX surveys_application_id_idx ON surveys(application_id);
