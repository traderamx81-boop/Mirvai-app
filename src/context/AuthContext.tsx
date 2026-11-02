import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, PropertyBrief, ChatMessage, InspectionAppointment, ClientDocument } from '../types';

interface AuthContextType {
  user: UserProfile;
  loginAsUser: (name: string, email: string, phone: string, authMethod: UserProfile['authMethod']) => void;
  loginWithOneClick: () => void;
  logout: () => void;
  updateProfilePhoto: (dataUrl: string) => void;
  updateUser: (updates: Partial<UserProfile>) => void;
  togglePrivacyMode: () => void;
  savedPropertyIds: string[];
  toggleSaveProperty: (propertyId: string) => void;
  isPropertySaved: (propertyId: string) => boolean;
  briefs: PropertyBrief[];
  addBrief: (brief: Omit<PropertyBrief, 'id' | 'timestamp' | 'status'>) => void;
  messages: ChatMessage[];
  sendMessage: (text: string) => void;
  appointments: InspectionAppointment[];
  addAppointment: (appointment: Omit<InspectionAppointment, 'id' | 'status'>) => void;
  documents: ClientDocument[];
  exportUserData: () => void;
  clearUserData: () => void;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'signup';
  setAuthModalMode: (mode: 'login' | 'signup') => void;
  openAuthModal: (mode?: 'login' | 'signup') => void;
  privacyModalOpen: boolean;
  setPrivacyModalOpen: (open: boolean) => void;
}

const DEFAULT_USER: UserProfile = {
  id: 'usr_mirvai_client',
  name: 'Dr. Adeola Williams',
  email: 'a.williams@diaspora-uk.co',
  phone: '+44 7911 123456',
  photoUrl: null,
  role: 'Verified Diaspora Investor',
  isLoggedIn: false,
  authMethod: 'guest',
  privacyMode: true,
  biometricLock: false,
  createdAt: '2026-10-24T10:00:00Z',
};

const DEFAULT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'desk',
    text: 'Welcome to Mirvai. Tell us the property type, preferred location and budget you have in mind.',
    time: '09:15 AM',
  },
  {
    id: 'msg-2',
    sender: 'user',
    text: "I'm buying from abroad and need remote inspection support.",
    time: '09:20 AM',
  },
  {
    id: 'msg-3',
    sender: 'desk',
    text: 'Absolutely. We can explain the process and coordinate the next steps clearly before you commit.',
    time: '09:22 AM',
  },
];

const DEFAULT_DOCUMENTS: ClientDocument[] = [
  {
    id: 'doc-1',
    title: 'Governor’s Consent Title Verification Extract',
    type: 'Title Verification',
    date: 'Oct 28, 2026',
    fileSize: '2.4 MB',
    verifiedBy: 'Lagos State Lands Bureau Registry',
  },
  {
    id: 'doc-2',
    title: 'Draft Deed of Assignment & Escrow Covenant',
    type: 'Deed of Assignment',
    date: 'Oct 22, 2026',
    fileSize: '1.8 MB',
    verifiedBy: 'Mirvai Legal Advisory & Trustees',
  },
  {
    id: 'doc-3',
    title: 'Certified Registered Survey & Beacon Coordinates',
    type: 'Survey Plan',
    date: 'Oct 15, 2026',
    fileSize: '3.1 MB',
    verifiedBy: 'Office of the Surveyor-General',
  },
];

const DEFAULT_APPOINTMENTS: InspectionAppointment[] = [
  {
    id: 'apt-1',
    propertyTitle: 'Contemporary 4-Bed Terrace Duplex with BQ',
    type: 'Live 4K Drone Walkthrough',
    dateTime: 'Tomorrow at 02:00 PM (WAT / GMT+1)',
    status: 'Confirmed',
    agentName: 'Oluwaseun Adeyemi (Lead Surveyor)',
    meetingLink: 'https://mirvai.secure/stream/insp-904',
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('mirvai_user');
      return saved ? JSON.parse(saved) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  const [savedPropertyIds, setSavedPropertyIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('mirvai_saved_properties');
      return saved ? JSON.parse(saved) : ['prop-1', 'prop-2'];
    } catch {
      return ['prop-1', 'prop-2'];
    }
  });

  const [briefs, setBriefs] = useState<PropertyBrief[]>(() => {
    try {
      const saved = localStorage.getItem('mirvai_briefs');
      return saved ? JSON.parse(saved) : [
        {
          id: 'brf-1',
          propertyType: 'Terrace duplex',
          budgetRange: '₦150,000,000 – ₦300,000,000',
          contact: '+234 803 555 0192',
          detail: 'Lekki Phase 1 / Ikate corridor. Prefer gated estate with high security for diaspora rental investment.',
          timestamp: 'Yesterday at 4:30 PM',
          status: 'Senior Broker Assigned',
          privacyRelayActive: true,
        }
      ];
    } catch {
      return [];
    }
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('mirvai_chat_messages');
      return saved ? JSON.parse(saved) : DEFAULT_MESSAGES;
    } catch {
      return DEFAULT_MESSAGES;
    }
  });

  const [appointments, setAppointments] = useState<InspectionAppointment[]>(() => {
    try {
      const saved = localStorage.getItem('mirvai_appointments');
      return saved ? JSON.parse(saved) : DEFAULT_APPOINTMENTS;
    } catch {
      return DEFAULT_APPOINTMENTS;
    }
  });

  const [documents] = useState<ClientDocument[]>(DEFAULT_DOCUMENTS);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);

  const openAuthModal = (mode: 'login' | 'signup' = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  useEffect(() => {
    try {
      localStorage.setItem('mirvai_user', JSON.stringify(user));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem('mirvai_saved_properties', JSON.stringify(savedPropertyIds));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [savedPropertyIds]);

  useEffect(() => {
    try {
      localStorage.setItem('mirvai_briefs', JSON.stringify(briefs));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [briefs]);

  useEffect(() => {
    try {
      localStorage.setItem('mirvai_chat_messages', JSON.stringify(messages));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [messages]);

  useEffect(() => {
    try {
      localStorage.setItem('mirvai_appointments', JSON.stringify(appointments));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [appointments]);

  const loginAsUser = (name: string, email: string, phone: string, authMethod: UserProfile['authMethod']) => {
    setUser({
      ...user,
      id: `usr_${Date.now()}`,
      name: name || 'Mirvai Client',
      email: email || 'client@mirvai.com',
      phone: phone || '+234 803 555 0192',
      isLoggedIn: true,
      authMethod,
    });
    setAuthModalOpen(false);
  };

  const loginWithOneClick = () => {
    setUser({
      ...user,
      name: 'Dr. Adeola Williams',
      email: 'a.williams@diaspora-uk.co',
      phone: '+44 7911 123456',
      isLoggedIn: true,
      authMethod: 'passkey',
    });
    setAuthModalOpen(false);
  };

  const logout = () => {
    setUser({
      ...DEFAULT_USER,
      isLoggedIn: false,
      authMethod: 'guest',
    });
  };

  const updateProfilePhoto = (dataUrl: string) => {
    setUser(prev => ({
      ...prev,
      photoUrl: dataUrl,
    }));
  };

  const updateUser = (updates: Partial<UserProfile>) => {
    setUser(prev => ({
      ...prev,
      ...updates,
    }));
  };

  const togglePrivacyMode = () => {
    setUser(prev => ({
      ...prev,
      privacyMode: !prev.privacyMode,
    }));
  };

  const toggleSaveProperty = (propertyId: string) => {
    setSavedPropertyIds(prev =>
      prev.includes(propertyId) ? prev.filter(id => id !== propertyId) : [...prev, propertyId]
    );
  };

  const isPropertySaved = (propertyId: string) => savedPropertyIds.includes(propertyId);

  const addBrief = (briefData: Omit<PropertyBrief, 'id' | 'timestamp' | 'status'>) => {
    const newBrief: PropertyBrief = {
      ...briefData,
      id: `brf-${Date.now()}`,
      timestamp: 'Just now',
      status: 'Received',
    };
    setBriefs(prev => [newBrief, ...prev]);
  };

  const sendMessage = (text: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);

    // Intelligent agent response simulation for Mirvai property desk
    setTimeout(() => {
      let replyText = "Thank you. Our senior advisory desk has noted your requirements. Would you like us to schedule a live 4K drone walkthrough or verify the land titles with the ministry first?";
      const lower = text.toLowerCase();
      if (lower.includes('price') || lower.includes('cost') || lower.includes('budget')) {
        replyText = "We maintain transparent pricing with zero undisclosed markups. Our verified listings range from ₦85M for land to ₦650M for prime waterfront terraces.";
      } else if (lower.includes('inspect') || lower.includes('remote') || lower.includes('diaspora') || lower.includes('abroad')) {
        replyText = "For clients abroad, we conduct 3-phase remote inspections: unedited 4K drone perimeter scan, live WhatsApp/Zoom interior walkthrough, and certified beacon coordinates verification.";
      } else if (lower.includes('title') || lower.includes('c of o') || lower.includes('governor') || lower.includes('deed')) {
        replyText = "Every property on Mirvai passes rigorous title search at the State Lands Registry. We confirm Governor's Consent and unencumbered title before publication.";
      } else if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
        replyText = "Hello! Mirvai Property Desk is active. How may we assist your property acquisition today?";
      }

      const deskMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'desk',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, deskMsg]);
    }, 1100);
  };

  const addAppointment = (aptData: Omit<InspectionAppointment, 'id' | 'status'>) => {
    const newApt: InspectionAppointment = {
      ...aptData,
      id: `apt-${Date.now()}`,
      status: 'Confirmed',
    };
    setAppointments(prev => [newApt, ...prev]);
  };

  const exportUserData = () => {
    const data = {
      user,
      savedPropertyIds,
      briefs,
      messages,
      appointments,
      exportedAt: new Date().toISOString(),
      privacyProtocol: 'Mirvai Zero-Knowledge Client Vault v2.1',
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mirvai-privacy-vault-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearUserData = () => {
    localStorage.removeItem('mirvai_user');
    localStorage.removeItem('mirvai_saved_properties');
    localStorage.removeItem('mirvai_briefs');
    localStorage.removeItem('mirvai_chat_messages');
    localStorage.removeItem('mirvai_appointments');
    setUser({ ...DEFAULT_USER, isLoggedIn: false });
    setSavedPropertyIds([]);
    setBriefs([]);
    setMessages(DEFAULT_MESSAGES);
    setAppointments([]);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loginAsUser,
        loginWithOneClick,
        logout,
        updateProfilePhoto,
        updateUser,
        togglePrivacyMode,
        savedPropertyIds,
        toggleSaveProperty,
        isPropertySaved,
        briefs,
        addBrief,
        messages,
        sendMessage,
        appointments,
        addAppointment,
        documents,
        exportUserData,
        clearUserData,
        authModalOpen,
        setAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        openAuthModal,
        privacyModalOpen,
        setPrivacyModalOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
