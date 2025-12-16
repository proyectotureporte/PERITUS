-- PERITUS Platform Database Schema
-- PostgreSQL / Supabase

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Custom types
CREATE TYPE user_role AS ENUM ('cliente', 'perito', 'admin');
CREATE TYPE case_status AS ENUM ('draft', 'pending_assignment', 'assigned', 'in_progress', 'review', 'completed', 'cancelled', 'disputed');
CREATE TYPE payment_status AS ENUM ('pending', 'escrow', 'released', 'refunded', 'disputed');
CREATE TYPE expert_verification_status AS ENUM ('pending', 'documents_submitted', 'under_review', 'verified', 'rejected');
CREATE TYPE specialty AS ENUM ('finanzas', 'psicologia', 'ingenieria', 'medicina', 'informatica', 'seguridad_digital', 'documentologia', 'grafologia', 'contabilidad', 'ambiental', 'urbanistica', 'legal');
CREATE TYPE urgency_level AS ENUM ('normal', 'urgent', 'critical');
CREATE TYPE company_type AS ENUM ('abogado_independiente', 'firma', 'empresa', 'entidad_publica', 'juez');
CREATE TYPE document_type AS ENUM ('cedula', 'titulo', 'certificacion', 'tarjeta_profesional', 'otro');
CREATE TYPE report_status AS ENUM ('draft', 'submitted', 'revision_requested', 'approved', 'final');
CREATE TYPE message_type AS ENUM ('text', 'file', 'system');
CREATE TYPE notification_type AS ENUM ('case_update', 'message', 'payment', 'system', 'deadline', 'review');
CREATE TYPE activity_type AS ENUM ('contact_attempt', 'data_export', 'pattern_detected', 'tos_violation');
CREATE TYPE severity_level AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE invoice_status AS ENUM ('draft', 'sent', 'paid', 'cancelled');

-- Profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    role user_role NOT NULL DEFAULT 'cliente',
    is_active BOOLEAN NOT NULL DEFAULT true,
    email_verified BOOLEAN NOT NULL DEFAULT false,
    two_factor_enabled BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Client profiles
CREATE TABLE client_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    company_name TEXT,
    company_type company_type,
    bar_number TEXT, -- Número de tarjeta profesional
    city TEXT NOT NULL,
    department TEXT NOT NULL,
    address TEXT,
    billing_info JSONB DEFAULT '{}',
    total_cases INTEGER NOT NULL DEFAULT 0,
    active_cases INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(profile_id)
);

-- Expert profiles
CREATE TABLE expert_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    specialties specialty[] NOT NULL DEFAULT '{}',
    bio TEXT NOT NULL DEFAULT '',
    experience_years INTEGER NOT NULL DEFAULT 0,
    hourly_rate DECIMAL(10,2),
    base_rate DECIMAL(10,2),
    city TEXT NOT NULL,
    department TEXT NOT NULL,
    is_available BOOLEAN NOT NULL DEFAULT true,
    verification_status expert_verification_status NOT NULL DEFAULT 'pending',
    verification_date TIMESTAMPTZ,
    verified_by UUID REFERENCES profiles(id),
    rating_average DECIMAL(3,2) NOT NULL DEFAULT 0.00,
    rating_count INTEGER NOT NULL DEFAULT 0,
    total_cases INTEGER NOT NULL DEFAULT 0,
    completed_cases INTEGER NOT NULL DEFAULT 0,
    response_time_hours INTEGER NOT NULL DEFAULT 24,
    certifications JSONB NOT NULL DEFAULT '[]',
    education JSONB NOT NULL DEFAULT '[]',
    work_experience JSONB NOT NULL DEFAULT '[]',
    sample_reports TEXT[] DEFAULT '{}',
    documents JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(profile_id)
);

-- Function to generate case numbers
CREATE OR REPLACE FUNCTION generate_case_number()
RETURNS TEXT AS $$
DECLARE
    year_part TEXT;
    seq_num INTEGER;
    new_case_number TEXT;
BEGIN
    year_part := TO_CHAR(NOW(), 'YYYY');
    SELECT COALESCE(MAX(CAST(SUBSTRING(case_number FROM 'CNP-\d{4}-(\d+)') AS INTEGER)), 0) + 1
    INTO seq_num
    FROM cases
    WHERE case_number LIKE 'CNP-' || year_part || '-%';
    new_case_number := 'CNP-' || year_part || '-' || LPAD(seq_num::TEXT, 6, '0');
    RETURN new_case_number;
END;
$$ LANGUAGE plpgsql;

-- Cases table
CREATE TABLE cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_number TEXT UNIQUE NOT NULL DEFAULT generate_case_number(),
    client_id UUID NOT NULL REFERENCES client_profiles(id) ON DELETE RESTRICT,
    expert_id UUID REFERENCES expert_profiles(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    specialty specialty NOT NULL,
    urgency urgency_level NOT NULL DEFAULT 'normal',
    status case_status NOT NULL DEFAULT 'draft',
    court_name TEXT,
    court_case_number TEXT,
    deadline TIMESTAMPTZ,
    estimated_hours INTEGER,
    agreed_rate DECIMAL(10,2),
    total_amount DECIMAL(12,2),
    payment_status payment_status NOT NULL DEFAULT 'pending',
    client_notes TEXT,
    expert_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    assigned_at TIMESTAMPTZ,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ
);

-- Case documents
CREATE TABLE case_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
    uploaded_by UUID NOT NULL REFERENCES profiles(id),
    name TEXT NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    is_confidential BOOLEAN NOT NULL DEFAULT false,
    document_hash TEXT NOT NULL, -- SHA-256 hash for integrity
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Case reports
CREATE TABLE case_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
    expert_id UUID NOT NULL REFERENCES expert_profiles(id),
    version INTEGER NOT NULL DEFAULT 1,
    title TEXT NOT NULL,
    content TEXT,
    file_url TEXT,
    file_hash TEXT,
    status report_status NOT NULL DEFAULT 'draft',
    quality_score DECIMAL(3,2),
    ai_review_notes TEXT,
    client_feedback TEXT,
    submitted_at TIMESTAMPTZ,
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Case timeline (audit trail)
CREATE TABLE case_timeline (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
    actor_id UUID NOT NULL REFERENCES profiles(id),
    action TEXT NOT NULL,
    description TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Chat rooms
CREATE TABLE chat_rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID UNIQUE NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Chat messages
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id UUID NOT NULL REFERENCES chat_rooms(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES profiles(id),
    content TEXT NOT NULL,
    message_type message_type NOT NULL DEFAULT 'text',
    file_url TEXT,
    file_name TEXT,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Payments
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID NOT NULL REFERENCES cases(id) ON DELETE RESTRICT,
    payer_id UUID NOT NULL REFERENCES profiles(id),
    payee_id UUID NOT NULL REFERENCES profiles(id),
    amount DECIMAL(12,2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'COP',
    status payment_status NOT NULL DEFAULT 'pending',
    payment_method TEXT,
    payment_gateway TEXT NOT NULL,
    gateway_transaction_id TEXT,
    escrow_released_at TIMESTAMPTZ,
    invoice_url TEXT,
    receipt_url TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Invoices
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
    invoice_number TEXT UNIQUE NOT NULL,
    client_id UUID NOT NULL REFERENCES profiles(id),
    expert_id UUID NOT NULL REFERENCES profiles(id),
    case_id UUID NOT NULL REFERENCES cases(id),
    subtotal DECIMAL(12,2) NOT NULL,
    tax_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    total DECIMAL(12,2) NOT NULL,
    status invoice_status NOT NULL DEFAULT 'draft',
    pdf_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Reviews
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
    reviewer_id UUID NOT NULL REFERENCES profiles(id),
    reviewed_id UUID NOT NULL REFERENCES profiles(id),
    rating DECIMAL(2,1) NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    professionalism_rating DECIMAL(2,1) CHECK (professionalism_rating >= 1 AND professionalism_rating <= 5),
    communication_rating DECIMAL(2,1) CHECK (communication_rating >= 1 AND communication_rating <= 5),
    quality_rating DECIMAL(2,1) CHECK (quality_rating >= 1 AND quality_rating <= 5),
    timeliness_rating DECIMAL(2,1) CHECK (timeliness_rating >= 1 AND timeliness_rating <= 5),
    is_public BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(case_id, reviewer_id)
);

-- Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type notification_type NOT NULL,
    link TEXT,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Audit logs
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID NOT NULL REFERENCES profiles(id),
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID NOT NULL,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Suspicious activities (anti-circumvention)
CREATE TABLE suspicious_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID REFERENCES cases(id) ON DELETE SET NULL,
    user_id UUID NOT NULL REFERENCES profiles(id),
    activity_type activity_type NOT NULL,
    severity severity_level NOT NULL DEFAULT 'low',
    description TEXT NOT NULL,
    evidence JSONB DEFAULT '{}',
    resolved BOOLEAN NOT NULL DEFAULT false,
    resolved_by UUID REFERENCES profiles(id),
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_client_profiles_profile ON client_profiles(profile_id);
CREATE INDEX idx_client_profiles_city ON client_profiles(city);
CREATE INDEX idx_expert_profiles_profile ON expert_profiles(profile_id);
CREATE INDEX idx_expert_profiles_specialties ON expert_profiles USING GIN(specialties);
CREATE INDEX idx_expert_profiles_verification ON expert_profiles(verification_status);
CREATE INDEX idx_expert_profiles_rating ON expert_profiles(rating_average DESC);
CREATE INDEX idx_expert_profiles_available ON expert_profiles(is_available) WHERE is_available = true;
CREATE INDEX idx_cases_client ON cases(client_id);
CREATE INDEX idx_cases_expert ON cases(expert_id);
CREATE INDEX idx_cases_status ON cases(status);
CREATE INDEX idx_cases_specialty ON cases(specialty);
CREATE INDEX idx_cases_created ON cases(created_at DESC);
CREATE INDEX idx_case_documents_case ON case_documents(case_id);
CREATE INDEX idx_case_reports_case ON case_reports(case_id);
CREATE INDEX idx_case_timeline_case ON case_timeline(case_id);
CREATE INDEX idx_chat_messages_room ON chat_messages(room_id);
CREATE INDEX idx_chat_messages_created ON chat_messages(created_at DESC);
CREATE INDEX idx_payments_case ON payments(case_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_reviews_reviewed ON reviews(reviewed_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = false;
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_actor ON audit_logs(actor_id);
CREATE INDEX idx_suspicious_activities_user ON suspicious_activities(user_id);
CREATE INDEX idx_suspicious_activities_unresolved ON suspicious_activities(resolved) WHERE resolved = false;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_client_profiles_updated_at BEFORE UPDATE ON client_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_expert_profiles_updated_at BEFORE UPDATE ON expert_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_cases_updated_at BEFORE UPDATE ON cases FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_case_reports_updated_at BEFORE UPDATE ON case_reports FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_chat_rooms_updated_at BEFORE UPDATE ON chat_rooms FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Function to update expert rating
CREATE OR REPLACE FUNCTION update_expert_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE expert_profiles
    SET
        rating_average = (
            SELECT COALESCE(AVG(rating), 0)
            FROM reviews r
            JOIN profiles p ON r.reviewed_id = p.id
            WHERE p.id = (SELECT profile_id FROM expert_profiles WHERE id = NEW.reviewed_id)
        ),
        rating_count = (
            SELECT COUNT(*)
            FROM reviews r
            JOIN profiles p ON r.reviewed_id = p.id
            WHERE p.id = (SELECT profile_id FROM expert_profiles WHERE id = NEW.reviewed_id)
        )
    WHERE profile_id = NEW.reviewed_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update case counts
CREATE OR REPLACE FUNCTION update_case_counts()
RETURNS TRIGGER AS $$
BEGIN
    -- Update client case counts
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        UPDATE client_profiles
        SET
            total_cases = (SELECT COUNT(*) FROM cases WHERE client_id = NEW.client_id),
            active_cases = (SELECT COUNT(*) FROM cases WHERE client_id = NEW.client_id AND status NOT IN ('completed', 'cancelled'))
        WHERE id = NEW.client_id;

        -- Update expert case counts if assigned
        IF NEW.expert_id IS NOT NULL THEN
            UPDATE expert_profiles
            SET
                total_cases = (SELECT COUNT(*) FROM cases WHERE expert_id = NEW.expert_id),
                completed_cases = (SELECT COUNT(*) FROM cases WHERE expert_id = NEW.expert_id AND status = 'completed')
            WHERE id = NEW.expert_id;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_case_counts_trigger
AFTER INSERT OR UPDATE ON cases
FOR EACH ROW EXECUTE FUNCTION update_case_counts();

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE expert_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE suspicious_activities ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Public profiles are viewable" ON profiles FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update all profiles" ON profiles FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Expert profiles policies
CREATE POLICY "Anyone can view verified experts" ON expert_profiles FOR SELECT USING (verification_status = 'verified');
CREATE POLICY "Experts can view and edit their own profile" ON expert_profiles FOR ALL USING (
    profile_id = auth.uid()
);
CREATE POLICY "Admins can manage all expert profiles" ON expert_profiles FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Client profiles policies
CREATE POLICY "Clients can view and edit their own profile" ON client_profiles FOR ALL USING (
    profile_id = auth.uid()
);
CREATE POLICY "Admins can manage all client profiles" ON client_profiles FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Cases policies
CREATE POLICY "Clients can view their own cases" ON cases FOR SELECT USING (
    client_id IN (SELECT id FROM client_profiles WHERE profile_id = auth.uid())
);
CREATE POLICY "Experts can view their assigned cases" ON cases FOR SELECT USING (
    expert_id IN (SELECT id FROM expert_profiles WHERE profile_id = auth.uid())
);
CREATE POLICY "Clients can create cases" ON cases FOR INSERT WITH CHECK (
    client_id IN (SELECT id FROM client_profiles WHERE profile_id = auth.uid())
);
CREATE POLICY "Admins can manage all cases" ON cases FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update their own notifications" ON notifications FOR UPDATE USING (user_id = auth.uid());

-- Chat policies
CREATE POLICY "Case participants can view chat rooms" ON chat_rooms FOR SELECT USING (
    case_id IN (
        SELECT c.id FROM cases c
        LEFT JOIN client_profiles cp ON c.client_id = cp.id
        LEFT JOIN expert_profiles ep ON c.expert_id = ep.id
        WHERE cp.profile_id = auth.uid() OR ep.profile_id = auth.uid()
    )
);

CREATE POLICY "Case participants can view messages" ON chat_messages FOR SELECT USING (
    room_id IN (
        SELECT cr.id FROM chat_rooms cr
        JOIN cases c ON cr.case_id = c.id
        LEFT JOIN client_profiles cp ON c.client_id = cp.id
        LEFT JOIN expert_profiles ep ON c.expert_id = ep.id
        WHERE cp.profile_id = auth.uid() OR ep.profile_id = auth.uid()
    )
);

CREATE POLICY "Case participants can send messages" ON chat_messages FOR INSERT WITH CHECK (
    sender_id = auth.uid() AND
    room_id IN (
        SELECT cr.id FROM chat_rooms cr
        JOIN cases c ON cr.case_id = c.id
        LEFT JOIN client_profiles cp ON c.client_id = cp.id
        LEFT JOIN expert_profiles ep ON c.expert_id = ep.id
        WHERE cp.profile_id = auth.uid() OR ep.profile_id = auth.uid()
    )
);

-- Function for expert matching
CREATE OR REPLACE FUNCTION match_experts(
    case_specialty specialty,
    case_urgency urgency_level,
    client_city TEXT
)
RETURNS TABLE (
    expert_id UUID,
    match_score DECIMAL,
    reasons TEXT[]
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        ep.id as expert_id,
        (
            -- Base score
            50.0 +
            -- Specialty match (30 points)
            CASE WHEN case_specialty = ANY(ep.specialties) THEN 30 ELSE 0 END +
            -- Rating bonus (up to 15 points)
            (ep.rating_average * 3) +
            -- City match (5 points)
            CASE WHEN ep.city = client_city THEN 5 ELSE 0 END +
            -- Availability bonus
            CASE WHEN ep.is_available THEN 5 ELSE -20 END +
            -- Experience bonus
            LEAST(ep.experience_years, 10)
        )::DECIMAL as match_score,
        ARRAY_REMOVE(ARRAY[
            CASE WHEN case_specialty = ANY(ep.specialties) THEN 'Especialidad coincidente' END,
            CASE WHEN ep.rating_average >= 4.5 THEN 'Calificación excelente' END,
            CASE WHEN ep.city = client_city THEN 'Misma ciudad' END,
            CASE WHEN ep.response_time_hours <= 12 THEN 'Respuesta rápida' END,
            CASE WHEN ep.completed_cases >= 10 THEN 'Experiencia comprobada' END
        ], NULL) as reasons
    FROM expert_profiles ep
    WHERE
        ep.verification_status = 'verified'
        AND ep.is_available = true
        AND case_specialty = ANY(ep.specialties)
    ORDER BY match_score DESC
    LIMIT 10;
END;
$$ LANGUAGE plpgsql;

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'cliente')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Storage buckets (to be created in Supabase dashboard)
-- - documents: Case documents (private)
-- - avatars: User avatars (public)
-- - reports: Expert reports (private)
