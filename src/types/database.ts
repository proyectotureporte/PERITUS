// Types for Supabase Database - PERITUS Platform

export type UserRole = 'cliente' | 'perito' | 'admin';

export type CaseStatus =
  | 'draft'
  | 'pending_assignment'
  | 'assigned'
  | 'in_progress'
  | 'review'
  | 'completed'
  | 'cancelled'
  | 'disputed';

export type PaymentStatus =
  | 'pending'
  | 'escrow'
  | 'released'
  | 'refunded'
  | 'disputed';

export type ExpertVerificationStatus =
  | 'pending'
  | 'documents_submitted'
  | 'under_review'
  | 'verified'
  | 'rejected';

export type Specialty =
  | 'finanzas'
  | 'psicologia'
  | 'ingenieria'
  | 'medicina'
  | 'informatica'
  | 'seguridad_digital'
  | 'documentologia'
  | 'grafologia'
  | 'contabilidad'
  | 'ambiental'
  | 'urbanistica'
  | 'legal';

export type UrgencyLevel = 'normal' | 'urgent' | 'critical';

// Base User Profile
export interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  role: UserRole;
  is_active: boolean;
  email_verified: boolean;
  two_factor_enabled: boolean;
  created_at: string;
  updated_at: string;
}

// Client Profile (Abogado, Firma, Empresa, Juez)
export interface ClientProfile {
  id: string;
  profile_id: string;
  company_name?: string;
  company_type?: 'abogado_independiente' | 'firma' | 'empresa' | 'entidad_publica' | 'juez';
  bar_number?: string; // Número de tarjeta profesional
  city: string;
  department: string;
  address?: string;
  billing_info?: BillingInfo;
  total_cases: number;
  active_cases: number;
  created_at: string;
  updated_at: string;
}

// Expert Profile (Perito)
export interface ExpertProfile {
  id: string;
  profile_id: string;
  specialties: Specialty[];
  bio: string;
  experience_years: number;
  hourly_rate?: number;
  base_rate?: number;
  city: string;
  department: string;
  is_available: boolean;
  verification_status: ExpertVerificationStatus;
  verification_date?: string;
  verified_by?: string;
  rating_average: number;
  rating_count: number;
  total_cases: number;
  completed_cases: number;
  response_time_hours: number;
  certifications: Certification[];
  education: Education[];
  work_experience: WorkExperience[];
  sample_reports?: string[];
  documents: ExpertDocument[];
  created_at: string;
  updated_at: string;
}

export interface Certification {
  id: string;
  name: string;
  issuing_organization: string;
  issue_date: string;
  expiry_date?: string;
  document_url?: string;
  verified: boolean;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field_of_study: string;
  start_date: string;
  end_date?: string;
  document_url?: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  description?: string;
  start_date: string;
  end_date?: string;
}

export interface ExpertDocument {
  id: string;
  type: 'cedula' | 'titulo' | 'certificacion' | 'tarjeta_profesional' | 'otro';
  name: string;
  url: string;
  verified: boolean;
  uploaded_at: string;
}

export interface BillingInfo {
  tax_id?: string; // NIT o Cédula
  business_name?: string;
  address?: string;
  city?: string;
  department?: string;
}

// Case Management
export interface Case {
  id: string;
  case_number: string;
  client_id: string;
  expert_id?: string;
  title: string;
  description: string;
  specialty: Specialty;
  urgency: UrgencyLevel;
  status: CaseStatus;
  court_name?: string;
  court_case_number?: string;
  deadline?: string;
  estimated_hours?: number;
  agreed_rate?: number;
  total_amount?: number;
  payment_status: PaymentStatus;
  client_notes?: string;
  expert_notes?: string;
  created_at: string;
  updated_at: string;
  assigned_at?: string;
  started_at?: string;
  completed_at?: string;
}

export interface CaseDocument {
  id: string;
  case_id: string;
  uploaded_by: string;
  name: string;
  description?: string;
  file_url: string;
  file_type: string;
  file_size: number;
  is_confidential: boolean;
  document_hash: string; // SHA-256 hash for integrity
  created_at: string;
}

export interface CaseReport {
  id: string;
  case_id: string;
  expert_id: string;
  version: number;
  title: string;
  content?: string;
  file_url?: string;
  file_hash?: string;
  status: 'draft' | 'submitted' | 'revision_requested' | 'approved' | 'final';
  quality_score?: number;
  ai_review_notes?: string;
  client_feedback?: string;
  submitted_at?: string;
  approved_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CaseTimeline {
  id: string;
  case_id: string;
  actor_id: string;
  action: string;
  description: string;
  metadata?: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

// Chat System
export interface ChatRoom {
  id: string;
  case_id: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  room_id: string;
  sender_id: string;
  content: string;
  message_type: 'text' | 'file' | 'system';
  file_url?: string;
  file_name?: string;
  is_read: boolean;
  created_at: string;
}

// Payments
export interface Payment {
  id: string;
  case_id: string;
  payer_id: string;
  payee_id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  payment_method?: string;
  payment_gateway: string;
  gateway_transaction_id?: string;
  escrow_released_at?: string;
  invoice_url?: string;
  receipt_url?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: string;
  payment_id: string;
  invoice_number: string;
  client_id: string;
  expert_id: string;
  case_id: string;
  subtotal: number;
  tax_amount: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'cancelled';
  pdf_url?: string;
  created_at: string;
}

// Reviews and Ratings
export interface Review {
  id: string;
  case_id: string;
  reviewer_id: string;
  reviewed_id: string;
  rating: number;
  comment?: string;
  professionalism_rating?: number;
  communication_rating?: number;
  quality_rating?: number;
  timeliness_rating?: number;
  is_public: boolean;
  created_at: string;
}

// Notifications
export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'case_update' | 'message' | 'payment' | 'system' | 'deadline' | 'review';
  link?: string;
  is_read: boolean;
  created_at: string;
}

// Admin Audit Log
export interface AuditLog {
  id: string;
  actor_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  old_values?: Record<string, unknown>;
  new_values?: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

// AI Matching
export interface ExpertMatch {
  expert_id: string;
  expert: ExpertProfile;
  match_score: number;
  reasons: string[];
  estimated_response_time: string;
  availability: boolean;
}

// Anti-circumvention tracking
export interface SuspiciousActivity {
  id: string;
  case_id?: string;
  user_id: string;
  activity_type: 'contact_attempt' | 'data_export' | 'pattern_detected' | 'tos_violation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  evidence?: Record<string, unknown>;
  resolved: boolean;
  resolved_by?: string;
  resolved_at?: string;
  created_at: string;
}

// Database types for Supabase
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id'>>;
      };
      client_profiles: {
        Row: ClientProfile;
        Insert: Omit<ClientProfile, 'id' | 'created_at' | 'updated_at' | 'total_cases' | 'active_cases'>;
        Update: Partial<Omit<ClientProfile, 'id'>>;
      };
      expert_profiles: {
        Row: ExpertProfile;
        Insert: Omit<ExpertProfile, 'id' | 'created_at' | 'updated_at' | 'rating_average' | 'rating_count' | 'total_cases' | 'completed_cases'>;
        Update: Partial<Omit<ExpertProfile, 'id'>>;
      };
      cases: {
        Row: Case;
        Insert: Omit<Case, 'id' | 'case_number' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Case, 'id' | 'case_number'>>;
      };
      case_documents: {
        Row: CaseDocument;
        Insert: Omit<CaseDocument, 'id' | 'created_at'>;
        Update: Partial<Omit<CaseDocument, 'id'>>;
      };
      case_reports: {
        Row: CaseReport;
        Insert: Omit<CaseReport, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<CaseReport, 'id'>>;
      };
      case_timeline: {
        Row: CaseTimeline;
        Insert: Omit<CaseTimeline, 'id' | 'created_at'>;
        Update: never;
      };
      chat_rooms: {
        Row: ChatRoom;
        Insert: Omit<ChatRoom, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<ChatRoom, 'id'>>;
      };
      chat_messages: {
        Row: ChatMessage;
        Insert: Omit<ChatMessage, 'id' | 'created_at'>;
        Update: Partial<Omit<ChatMessage, 'id'>>;
      };
      payments: {
        Row: Payment;
        Insert: Omit<Payment, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Payment, 'id'>>;
      };
      reviews: {
        Row: Review;
        Insert: Omit<Review, 'id' | 'created_at'>;
        Update: Partial<Omit<Review, 'id'>>;
      };
      notifications: {
        Row: Notification;
        Insert: Omit<Notification, 'id' | 'created_at'>;
        Update: Partial<Omit<Notification, 'id'>>;
      };
      audit_logs: {
        Row: AuditLog;
        Insert: Omit<AuditLog, 'id' | 'created_at'>;
        Update: never;
      };
      suspicious_activities: {
        Row: SuspiciousActivity;
        Insert: Omit<SuspiciousActivity, 'id' | 'created_at'>;
        Update: Partial<Omit<SuspiciousActivity, 'id'>>;
      };
    };
    Functions: {
      match_experts: {
        Args: { case_specialty: Specialty; case_urgency: UrgencyLevel; client_city: string };
        Returns: ExpertMatch[];
      };
      generate_case_number: {
        Args: Record<string, never>;
        Returns: string;
      };
    };
  };
}
