export type PageId =
  | 'inicio'
  | 'explorar'
  | 'perfil'
  | 'solicitudes'
  | 'mensajes'
  | 'acceso'
  | 'panel-tutor'
  | 'verificacion';

export type VerificationStatus = 'verificado' | 'pendiente' | 'rechazado';

export type Modality = 'Virtual' | 'Presencial' | 'Híbrido';

export type SubjectCategory =
  | 'Matemáticas y Cálculo'
  | 'Inglés y Certificaciones'
  | 'Programación y Datos'
  | 'Física y Química'
  | 'Contabilidad y Finanzas'
  | 'Reforzamiento Escolar';

export type HondurasCity =
  | 'Tegucigalpa'
  | 'San Pedro Sula'
  | 'La Ceiba'
  | 'Comayagua'
  | 'Choluteca';

export interface ReviewItem {
  id: string;
  tutorId: string;
  authorName: string;
  authorRole: string;
  rating: number;
  date: string;
  subject: string;
  comment: string;
  outcome: string;
}

export interface AvailabilitySlot {
  day: string;
  hours: string[];
}

export interface Tutor {
  id: string;
  name: string;
  headline: string;
  category: SubjectCategory;
  specialties: string[];
  city: HondurasCity;
  zoneDetail: string;
  modality: Modality;
  hourlyRateHnl: number;
  rating: number;
  reviewCount: number;
  completedSessions: number;
  responseTime: string;
  verificationStatus: VerificationStatus;
  verificationNote: string;
  university: string;
  yearsExperience: number;
  bio: string;
  methodology: string;
  credentials: string[];
  availability: AvailabilitySlot[];
  portraitUrl: string;
  initials: string;
  accentHex: string;
}

export type RequestStatus = 'pendiente' | 'aceptada' | 'rechazada';

export interface TutoringRequest {
  id: string;
  tutorId: string;
  tutorName: string;
  tutorHeadline: string;
  tutorCity: HondurasCity;
  tutorPortraitUrl: string;
  studentName: string;
  studentRole: string;
  subject: string;
  date: string;
  timeSlot: string;
  modality: 'Virtual' | 'Presencial';
  durationHours: number;
  topicNotes: string;
  hourlyRateHnl: number;
  subtotalHnl: number;
  platformFeeHnl: number;
  totalPaidHnl: number;
  paymentMethodLabel: string;
  paymentReference: string;
  status: RequestStatus;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'estudiante' | 'tutor' | 'sistema';
  senderName: string;
  text: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  requestId: string;
  tutorId: string;
  tutorName: string;
  tutorHeadline: string;
  tutorPortraitUrl: string;
  studentName: string;
  subject: string;
  scheduledDate: string;
  scheduledTime: string;
  modality: 'Virtual' | 'Presencial';
  messages: ChatMessage[];
}

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: 'estudiante' | 'padre' | 'tutor';
  city: HondurasCity;
  linkedTutorId?: string;
}
