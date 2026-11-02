export type PropertyCategory = 
  | 'All'
  | 'Terrace'
  | 'Detached'
  | 'Semi-detached'
  | 'Land'
  | 'Off-plan'
  | 'Commercial';

export type DivisionId =
  | 'realty'
  | 'developments'
  | 'construction'
  | 'technology'
  | 'energy'
  | 'communities';

export interface MaterialItem {
  id: string;
  name: string;
  category: string;
  spec: string;
  unit: string;
  estPrice: string;
}

export interface Property {
  id: string;
  category: PropertyCategory;
  categoryLabel: string; // e.g. "TERRACE DUPLEX", "RESIDENTIAL LAND"
  title: string;
  subLocation: string; // e.g. "Lagos · details appear after verification"
  fullLocation: string; // e.g. "Lekki Phase 1, Lagos"
  priceDisplay: string; // e.g. "Price on request" or "₦185,000,000"
  numericPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  areaSqMeters?: number;
  imageUrl: string;
  isVerified: boolean;
  titleType: 'Governor’s Consent' | 'Certificate of Occupancy' | 'Gazette' | 'Deed of Conveyance';
  description: string;
  features: string[];
  inspectionAvailable: boolean;
  diasporaEligible: boolean;
  coordinates?: { lat: number; lng: number };
}

export interface PropertyBrief {
  id: string;
  propertyType: string;
  budgetRange: string;
  contact: string;
  detail: string;
  timestamp: string;
  status: 'Received' | 'Vetting in Progress' | 'Senior Broker Assigned' | 'Matches Ready';
  privacyRelayActive: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'desk' | 'user';
  text: string;
  time: string;
  isPrototypeNotice?: boolean;
}

export interface InspectionAppointment {
  id: string;
  propertyTitle: string;
  type: 'Live 4K Drone Walkthrough' | 'In-Person Broker Escort' | 'Surveyor Legal Inspection';
  dateTime: string;
  status: 'Confirmed' | 'Pending Scheduling';
  agentName: string;
  meetingLink?: string;
}

export interface ClientDocument {
  id: string;
  title: string;
  type: 'Title Verification' | 'Deed of Assignment' | 'Survey Plan' | 'Inspection Report';
  date: string;
  fileSize: string;
  verifiedBy: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  photoUrl: string | null;
  role: string;
  isLoggedIn: boolean;
  authMethod: 'guest' | 'biometric' | 'email' | 'passkey';
  privacyMode: boolean; // Masks contact details on briefs
  biometricLock: boolean;
  createdAt: string;
}
