-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Courses table
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    stripe_account_id TEXT,
    timezone TEXT DEFAULT 'UTC' NOT NULL,
    base_settings JSONB DEFAULT '{}'::jsonb
);

-- Pricing Rules table
CREATE TABLE pricing_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
    rule_type TEXT NOT NULL, -- 'weather', 'time_to_tee', 'utilization'
    parameters JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true
);

-- Tee Times table
CREATE TABLE tee_times (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
    time TIMESTAMP WITH TIME ZONE NOT NULL,
    base_price DECIMAL(10,2) NOT NULL,
    current_price DECIMAL(10,2) NOT NULL,
    status TEXT DEFAULT 'available' NOT NULL -- 'available', 'booked'
);

-- Bookings table
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    tee_time_id UUID REFERENCES tee_times(id) ON DELETE RESTRICT NOT NULL,
    golfer_name TEXT NOT NULL,
    golfer_email TEXT NOT NULL,
    amount_paid DECIMAL(10,2) NOT NULL,
    platform_fee_collected DECIMAL(10,2) NOT NULL,
    stripe_payment_intent_id TEXT
);

-- Row Level Security (RLS) Policies
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE tee_times ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Courses: Users can only see and update their own courses
CREATE POLICY "Users can view own courses" ON courses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own courses" ON courses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own courses" ON courses FOR UPDATE USING (auth.uid() = user_id);

-- Pricing Rules: Users can manage rules for their courses
CREATE POLICY "Users can manage pricing rules for own courses" ON pricing_rules
    USING (course_id IN (SELECT id FROM courses WHERE user_id = auth.uid()));

-- Tee Times: Anyone can view available tee times (for the booking widget)
CREATE POLICY "Anyone can view tee times" ON tee_times FOR SELECT USING (true);
CREATE POLICY "Users can manage tee times for own courses" ON tee_times
    FOR ALL USING (course_id IN (SELECT id FROM courses WHERE user_id = auth.uid()));

-- Bookings: Course owners can view their bookings
CREATE POLICY "Users can view bookings for own courses" ON bookings
    FOR SELECT USING (tee_time_id IN (SELECT id FROM tee_times WHERE course_id IN (SELECT id FROM courses WHERE user_id = auth.uid())));
-- Note: inserting bookings will typically be done via a secure server action after Stripe payment confirmation, so we might not need public insert RLS if we bypass RLS using the service role key.
