import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  MapPin,
  Star,
  ShieldCheck,
  CalendarPlus,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  XCircle,
  MessageSquare,
  SlidersHorizontal,
  RotateCcw,
  BookOpen,
  GraduationCap,
  UserCheck,
  Lock,
  Menu,
  X,
} from 'lucide-react';
import {
  PageId,
  Tutor,
  ReviewItem,
  TutoringRequest,
  Conversation,
  CurrentUser,
  VerificationStatus,
  SubjectCategory,
  HondurasCity,
  Modality,
} from './types';
import {
  INITIAL_TUTORS,
  INITIAL_REVIEWS,
  INITIAL_REQUESTS,
  INITIAL_CONVERSATIONS,
  DEFAULT_USER,
  SUBJECT_CATEGORIES,
  HONDURAS_CITIES,
} from './data/mockData';
import { TutorPortrait } from './components/TutorPortrait';
import { TutorCard, VerificationLabel } from './components/TutorCard';
import { BookingModal } from './components/BookingModal';
import {
  MessagesView,
  TutorPanelView,
  VerificationPanelView,
  AuthView,
} from './components/WorkspaceViews';

const STORAGE_KEYS = {
  TUTORS: 'tutorhn_tutors_v1',
  REVIEWS: 'tutorhn_reviews_v1',
  REQUESTS: 'tutorhn_requests_v1',
  CONVERSATIONS: 'tutorhn_conversations_v1',
  USER: 'tutorhn_user_v1',
};

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export default function App() {
  // Estado principal con persistencia en localStorage
  const [tutors, setTutors] = useState<Tutor[]>(() =>
    loadFromStorage(STORAGE_KEYS.TUTORS, INITIAL_TUTORS)
  );
  const [reviews, setReviews] = useState<ReviewItem[]>(() =>
    loadFromStorage(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS)
  );
  const [requests, setRequests] = useState<TutoringRequest[]>(() =>
    loadFromStorage(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS)
  );
  const [conversations, setConversations] = useState<Conversation[]>(() =>
    loadFromStorage(STORAGE_KEYS.CONVERSATIONS, INITIAL_CONVERSATIONS)
  );
  const [currentUser, setCurrentUser] = useState<CurrentUser>(() =>
    loadFromStorage(STORAGE_KEYS.USER, DEFAULT_USER)
  );

  // Navegación y vistas
  const [activePage, setActivePage] = useState<PageId>('inicio');
  const [selectedTutorId, setSelectedTutorId] = useState<string>('tutor-1');
  const [managedTutorId, setManagedTutorId] = useState<string>('tutor-2');
  const [activeConversationId, setActiveConversationId] = useState<string | null>('conv-101');
  const [bookingTutor, setBookingTutor] = useState<Tutor | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Notificación / confirmación visual
  const [toastMessage, setToastMessage] = useState<{
    title: string;
    detail?: string;
    actionLabel?: string;
    onAction?: () => void;
  } | null>(null);

  // Filtros en Explorar tutores
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [selectedCity, setSelectedCity] = useState<string>('Todas');
  const [selectedModality, setSelectedModality] = useState<string>('Todas');
  const [maxPriceHnl, setMaxPriceHnl] = useState<number>(600);
  const [onlyVerified, setOnlyVerified] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'rating' | 'price-asc' | 'experience'>('rating');

  // Filtro en Solicitudes y contrataciones
  const [requestStatusFilter, setRequestStatusFilter] = useState<
    'todas' | 'pendiente' | 'aceptada' | 'rechazada'
  >('todas');

  // Formulario de nueva reseña en Perfil del tutor
  const [newReviewRating, setNewReviewRating] = useState<number>(5);
  const [newReviewSubject, setNewReviewSubject] = useState<string>('');
  const [newReviewComment, setNewReviewComment] = useState<string>('');
  const [newReviewOutcome, setNewReviewOutcome] = useState<string>('');

  // Sincronización con localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TUTORS, JSON.stringify(tutors));
    } catch {
      // Ignorar errores de almacenamiento
    }
  }, [tutors]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
    } catch {
      // Ignorar
    }
  }, [reviews]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
    } catch {
      // Ignorar
    }
  }, [requests]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
    } catch {
      // Ignorar
    }
  }, [conversations]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
    } catch {
      // Ignorar
    }
  }, [currentUser]);

  const showNotification = (
    title: string,
    detail?: string,
    actionLabel?: string,
    onAction?: () => void
  ) => {
    setToastMessage({ title, detail, actionLabel, onAction });
  };

  const navigateTo = (page: PageId) => {
    setActivePage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenProfile = (tutorId: string) => {
    setSelectedTutorId(tutorId);
    navigateTo('perfil');
  };

  // Filtrado del catálogo de tutores
  const filteredTutors = useMemo(() => {
    return tutors
      .filter((tutor) => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = tutor.name.toLowerCase().includes(q);
          const matchHeadline = tutor.headline.toLowerCase().includes(q);
          const matchCategory = tutor.category.toLowerCase().includes(q);
          const matchSpec = tutor.specialties.some((s) => s.toLowerCase().includes(q));
          const matchCity = tutor.city.toLowerCase().includes(q);
          if (!matchName && !matchHeadline && !matchCategory && !matchSpec && !matchCity) {
            return false;
          }
        }
        if (selectedCategory !== 'Todas' && tutor.category !== selectedCategory) {
          return false;
        }
        if (selectedCity !== 'Todas' && tutor.city !== selectedCity) {
          return false;
        }
        if (selectedModality !== 'Todas') {
          if (selectedModality === 'Virtual' && tutor.modality === 'Presencial') return false;
          if (selectedModality === 'Presencial' && tutor.modality === 'Virtual') return false;
          if (selectedModality === 'Híbrido' && tutor.modality !== 'Híbrido') return false;
        }
        if (tutor.hourlyRateHnl > maxPriceHnl) {
          return false;
        }
        if (onlyVerified && tutor.verificationStatus !== 'verificado') {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.hourlyRateHnl - b.hourlyRateHnl;
        if (sortBy === 'experience') return b.yearsExperience - a.yearsExperience;
        return b.rating - a.rating;
      });
  }, [
    tutors,
    searchQuery,
    selectedCategory,
    selectedCity,
    selectedModality,
    maxPriceHnl,
    onlyVerified,
    sortBy,
  ]);

  const resetCatalogFilters = () => {
    setSearchQuery('');
    setSelectedCategory('Todas');
    setSelectedCity('Todas');
    setSelectedModality('Todas');
    setMaxPriceHnl(600);
    setOnlyVerified(false);
    setSortBy('rating');
  };

  // Confirmar nueva solicitud de tutoría
  const handleConfirmBooking = (newRequest: TutoringRequest) => {
    setRequests((prev) => [newRequest, ...prev]);
    setManagedTutorId(newRequest.tutorId);
    showNotification(
      `Solicitud #${newRequest.id} creada en estado Pendiente`,
      `Tutor: ${newRequest.tutorName} · Total en custodia: L. ${newRequest.totalPaidHnl}.00`,
      'Ir al Panel de Tutor para aceptar',
      () => {
        setManagedTutorId(newRequest.tutorId);
        navigateTo('panel-tutor');
      }
    );
  };

  // Aceptar solicitud desde el Panel de Tutor -> Habilita conversación en Mensajes
  const handleAcceptRequest = (requestId: string) => {
    const targetReq = requests.find((r) => r.id === requestId);
    if (!targetReq) return;

    setRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'aceptada' } : r))
    );

    const existingConv = conversations.find((c) => c.requestId === requestId);
    let targetConvId = existingConv?.id || `conv-${requestId}`;

    if (!existingConv) {
      const nowTime = new Date().toLocaleTimeString('es-HN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
      const newConv: Conversation = {
        id: targetConvId,
        requestId: targetReq.id,
        tutorId: targetReq.tutorId,
        tutorName: targetReq.tutorName,
        tutorHeadline: targetReq.tutorHeadline,
        tutorPortraitUrl: targetReq.tutorPortraitUrl,
        studentName: targetReq.studentName,
        subject: targetReq.subject,
        scheduledDate: targetReq.date,
        scheduledTime: targetReq.timeSlot,
        modality: targetReq.modality,
        messages: [
          {
            id: `msg-sys-${Date.now()}`,
            sender: 'sistema',
            senderName: 'TutorHn Garantía Académica',
            text: `Solicitud #${targetReq.id} aceptada por ${targetReq.tutorName}. El chat directo está habilitado para coordinar la sesión.`,
            timestamp: nowTime,
          },
          {
            id: `msg-welcome-${Date.now() + 1}`,
            sender: 'tutor',
            senderName: targetReq.tutorName,
            text: `¡Hola ${targetReq.studentName.split(' ')[0]}! He aceptado tu solicitud de tutoría de ${targetReq.subject} para el ${targetReq.date} a las ${targetReq.timeSlot}. Revisé tus notas ("${targetReq.topicNotes}"). ¿Tienes algún ejercicio adicional que quieras incluir?`,
            timestamp: nowTime,
          },
        ],
      };
      setConversations((prev) => [newConv, ...prev]);
    }

    setActiveConversationId(targetConvId);
    showNotification(
      `¡Solicitud #${targetReq.id} aceptada! Conversación habilitada`,
      `El canal de chat entre ${targetReq.studentName} y ${targetReq.tutorName} ya está disponible.`,
      'Abrir chat ahora',
      () => {
        setActiveConversationId(targetConvId);
        navigateTo('mensajes');
      }
    );
  };

  // Rechazar solicitud
  const handleRejectRequest = (requestId: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'rechazada' } : r))
    );
    showNotification(
      `Solicitud #${requestId} marcada como rechazada`,
      'El pago simulado en garantía fue liberado de vuelta al estudiante.'
    );
  };

  // Enviar mensaje en el chat
  const handleSendMessage = (convId: string, text: string) => {
    const nowTime = new Date().toLocaleTimeString('es-HN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id !== convId) return conv;
        return {
          ...conv,
          messages: [
            ...conv.messages,
            {
              id: `msg-${Date.now()}`,
              sender: 'estudiante',
              senderName: currentUser.name,
              text,
              timestamp: nowTime,
            },
          ],
        };
      })
    );
  };

  // Simular respuesta coherente del tutor en el chat
  const handleSimulateTutorReply = (convId: string) => {
    const targetConv = conversations.find((c) => c.id === convId);
    if (!targetConv) return;

    const replies = [
      `Perfecto, ${targetConv.studentName.split(' ')[0]}. Ya tengo lista la pizarra digital y 3 ejercicios tipo examen sobre ${targetConv.subject}. Nos vemos puntualmente a las ${targetConv.scheduledTime}.`,
      `¡Recibido! Te comparto por aquí el formulario resumido de ${targetConv.subject} para que lo tengamos abierto durante la sesión.`,
      `De acuerdo. Si tienes capturas de la guía de tu catedrático, tenlas listas al iniciar la llamada para resolverlas paso a paso.`,
    ];
    const replyText = replies[targetConv.messages.length % replies.length];

    const nowTime = new Date().toLocaleTimeString('es-HN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id !== convId) return conv;
        return {
          ...conv,
          messages: [
            ...conv.messages,
            {
              id: `msg-tutor-${Date.now()}`,
              sender: 'tutor',
              senderName: conv.tutorName,
              text: replyText,
              timestamp: nowTime,
            },
          ],
        };
      })
    );
  };

  // Cambiar estado de verificación de un tutor
  const handleChangeVerification = (
    tutorId: string,
    newStatus: VerificationStatus,
    newNote: string
  ) => {
    const targetTutor = tutors.find((t) => t.id === tutorId);
    setTutors((prev) =>
      prev.map((t) =>
        t.id === tutorId
          ? { ...t, verificationStatus: newStatus, verificationNote: newNote }
          : t
      )
    );
    if (targetTutor) {
      showNotification(
        `Estado de ${targetTutor.name} actualizado a: ${newStatus.toUpperCase()}`,
        newNote,
        'Ver perfil del tutor',
        () => handleOpenProfile(tutorId)
      );
    }
  };

  // Actualizar tarifa por hora desde el Panel de Tutor
  const handleUpdateTutorRate = (tutorId: string, newRate: number) => {
    setTutors((prev) =>
      prev.map((t) => (t.id === tutorId ? { ...t, hourlyRateHnl: newRate } : t))
    );
    showNotification(
      'Tarifa actualizada en el catálogo',
      `El nuevo precio por hora es L. ${newRate} / hora.`
    );
  };

  // Registrar nuevo tutor desde Acceso y Registro
  const handleRegisterNewTutor = (data: {
    name: string;
    email: string;
    city: HondurasCity;
    category: SubjectCategory;
    specialty: string;
    hourlyRateHnl: number;
    modality: Modality;
    university: string;
    bio: string;
  }) => {
    const newId = `tutor-${Date.now()}`;
    const initials = data.name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || 'T')
      .join('');

    const createdTutor: Tutor = {
      id: newId,
      name: data.name,
      headline: `Especialista en ${data.specialty}`,
      category: data.category,
      specialties: [data.specialty, data.category],
      city: data.city,
      zoneDetail: `Zona céntrica de ${data.city}`,
      modality: data.modality,
      hourlyRateHnl: data.hourlyRateHnl,
      rating: 5.0,
      reviewCount: 1,
      completedSessions: 1,
      responseTime: 'Responde en 15 min',
      verificationStatus: 'pendiente',
      verificationNote: `Registro nuevo (${data.email}): pendiente de validación de título de ${data.university}.`,
      university: data.university,
      yearsExperience: 3,
      bio: data.bio,
      methodology:
        'Clases personalizadas enfocadas en objetivos prácticos, resolución de guías y seguimiento continuo.',
      credentials: [`Egresado / Docente — ${data.university}`, 'Expediente enviado en TutorHn'],
      availability: [
        { day: 'Lunes', hours: ['16:00', '18:00'] },
        { day: 'Miércoles', hours: ['16:00', '18:00'] },
        { day: 'Sábado', hours: ['09:00', '11:00'] },
      ],
      portraitUrl: INITIAL_TUTORS[0].portraitUrl,
      initials: initials || 'TH',
      accentHex: '#0f766e',
    };

    setTutors((prev) => [createdTutor, ...prev]);
    setManagedTutorId(newId);
    setSelectedTutorId(newId);
    setCurrentUser({
      id: `user-${newId}`,
      name: data.name,
      email: data.email,
      role: 'tutor',
      city: data.city,
      linkedTutorId: newId,
    });

    showNotification(
      `Nuevo tutor registrado: ${data.name}`,
      'Puedes aprobar su verificación académica en el panel de Verificación de Tutores.',
      'Ir a Verificación de Tutores',
      () => navigateTo('verificacion')
    );
  };

  // Agregar nueva reseña en el perfil del tutor
  const handleAddReview = (e: React.FormEvent, tutorId: string) => {
    e.preventDefault();
    if (!newReviewComment.trim()) return;

    const newRev: ReviewItem = {
      id: `rev-${Date.now()}`,
      tutorId,
      authorName: currentUser.name,
      authorRole:
        currentUser.role === 'padre'
          ? `Padre / Madre de familia (${currentUser.city})`
          : `Estudiante (${currentUser.city})`,
      rating: newReviewRating,
      date: '24 oct 2026',
      subject: newReviewSubject.trim() || 'Tutoría personalizada',
      comment: newReviewComment.trim(),
      outcome:
        newReviewOutcome.trim() ||
        'Dominio de los temas de la sesión y mejora en evaluación académica',
    };

    setReviews((prev) => [newRev, ...prev]);
    setTutors((prev) =>
      prev.map((t) => {
        if (t.id !== tutorId) return t;
        const nextCount = t.reviewCount + 1;
        const nextRating = Number(
          ((t.rating * t.reviewCount + newReviewRating) / nextCount).toFixed(1)
        );
        return { ...t, reviewCount: nextCount, rating: nextRating };
      })
    );

    setNewReviewSubject('');
    setNewReviewComment('');
    setNewReviewOutcome('');
    showNotification(
      'Reseña publicada exitosamente',
      'La calificación y el listado de opiniones del tutor se han actualizado.'
    );
  };

  // Restaurar datos de demostración
  const handleResetDemo = () => {
    localStorage.removeItem(STORAGE_KEYS.TUTORS);
    localStorage.removeItem(STORAGE_KEYS.REVIEWS);
    localStorage.removeItem(STORAGE_KEYS.REQUESTS);
    localStorage.removeItem(STORAGE_KEYS.CONVERSATIONS);
    localStorage.removeItem(STORAGE_KEYS.USER);
    setTutors(INITIAL_TUTORS);
    setReviews(INITIAL_REVIEWS);
    setRequests(INITIAL_REQUESTS);
    setConversations(INITIAL_CONVERSATIONS);
    setCurrentUser(DEFAULT_USER);
    resetCatalogFilters();
    setActivePage('inicio');
    showNotification(
      'Datos de demostración restaurados',
      'Se han restablecido los tutores, solicitudes y conversaciones iniciales.'
    );
  };

  const selectedTutor = tutors.find((t) => t.id === selectedTutorId) || tutors[0];
  const selectedTutorReviews = reviews.filter((r) => r.tutorId === selectedTutor.id);
  const pendingRequestsCount = requests.filter((r) => r.status === 'pendiente').length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* ====================================================================
       * TOP BAR CONTRACT (Strict 3-Zone Header separated by gap-8)
       * ================================================================== */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xs border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#inicio"
            onClick={(e) => {
              e.preventDefault();
              navigateTo('inicio');
            }}
            className="text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 font-display"
          >
            TutorHn
          </a>

          {/* Zone 2: 5 concise single-line text navigation links */}
          <nav
            aria-label="Navegación principal"
            className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600"
          >
            <a
              href="#inicio"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('inicio');
              }}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 ${
                activePage === 'inicio'
                  ? 'text-slate-900 font-semibold border-b-2 border-emerald-700'
                  : ''
              }`}
            >
              Inicio
            </a>
            <a
              href="#explorar"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('explorar');
              }}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 ${
                activePage === 'explorar' || activePage === 'perfil'
                  ? 'text-slate-900 font-semibold border-b-2 border-emerald-700'
                  : ''
              }`}
            >
              Explorar tutores
            </a>
            <a
              href="#solicitudes"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('solicitudes');
              }}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 tabular-nums ${
                activePage === 'solicitudes'
                  ? 'text-slate-900 font-semibold border-b-2 border-emerald-700'
                  : ''
              }`}
            >
              Solicitudes ({requests.length})
            </a>
            <a
              href="#mensajes"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('mensajes');
              }}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 tabular-nums ${
                activePage === 'mensajes'
                  ? 'text-slate-900 font-semibold border-b-2 border-emerald-700'
                  : ''
              }`}
            >
              Mensajes ({conversations.length})
            </a>
            <a
              href="#panel-tutor"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('panel-tutor');
              }}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 tabular-nums ${
                activePage === 'panel-tutor'
                  ? 'text-slate-900 font-semibold border-b-2 border-emerald-700'
                  : ''
              }`}
            >
              Panel de tutor{pendingRequestsCount > 0 ? ` (${pendingRequestsCount})` : ''}
            </a>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => navigateTo('acceso')}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
            >
              Acceso y registro
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-700 hover:text-slate-900 rounded-lg border border-slate-200"
              aria-label="Abrir menú de navegación"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Menú móvil desplegable */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            {(
              [
                ['inicio', 'Inicio'],
                ['explorar', 'Explorar tutores'],
                ['solicitudes', `Solicitudes (${requests.length})`],
                ['mensajes', `Mensajes (${conversations.length})`],
                ['panel-tutor', `Panel de tutor (${pendingRequestsCount})`],
                ['verificacion', 'Verificación de tutores'],
                ['acceso', 'Acceso y registro'],
              ] as [PageId, string][]
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => navigateTo(id)}
                className={`px-3 py-2 text-left text-xs font-semibold rounded-lg ${
                  activePage === id
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ====================================================================
       * BARRA DE ENTORNO DE DEMOSTRACIÓN Y ACCESO A TODAS LAS VISTAS
       * ================================================================== */}
      <div className="bg-slate-900 text-slate-200 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-emerald-400">Recorrido de demostración:</span>
            <button
              type="button"
              onClick={() => navigateTo('inicio')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
                activePage === 'inicio' ? 'text-white font-semibold underline' : 'text-slate-300'
              }`}
            >
              1. Inicio
            </button>
            <span className="text-slate-600">→</span>
            <button
              type="button"
              onClick={() => navigateTo('explorar')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
                activePage === 'explorar' ? 'text-white font-semibold underline' : 'text-slate-300'
              }`}
            >
              2. Buscar tutor
            </button>
            <span className="text-slate-600">→</span>
            <button
              type="button"
              onClick={() => handleOpenProfile(selectedTutorId)}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
                activePage === 'perfil' ? 'text-white font-semibold underline' : 'text-slate-300'
              }`}
            >
              3. Abrir perfil
            </button>
            <span className="text-slate-600">→</span>
            <button
              type="button"
              onClick={() => setBookingTutor(selectedTutor)}
              className="text-slate-300 hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              4. Solicitar tutoría
            </button>
            <span className="text-slate-600">→</span>
            <button
              type="button"
              onClick={() => navigateTo('panel-tutor')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
                activePage === 'panel-tutor'
                  ? 'text-white font-semibold underline'
                  : 'text-slate-300'
              }`}
            >
              5. Aceptar en Panel Tutor
            </button>
            <span className="text-slate-600">→</span>
            <button
              type="button"
              onClick={() => navigateTo('mensajes')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
                activePage === 'mensajes' ? 'text-white font-semibold underline' : 'text-slate-300'
              }`}
            >
              6. Abrir chat
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigateTo('verificacion')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-colors whitespace-nowrap shrink-0 ${
                activePage === 'verificacion'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
            >
              Panel Verificación de Tutores
            </button>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <button
              type="button"
              onClick={() => navigateTo('acceso')}
              className="text-slate-300 hover:text-white whitespace-nowrap shrink-0 hidden sm:inline"
            >
              Sesión: <strong className="text-white">{currentUser.name}</strong>
            </button>
          </div>
        </div>
      </div>

      {/* ====================================================================
       * BANNER DE CONFIRMACIÓN / FEEDBACK DE ACCIONES
       * ================================================================== */}
      {toastMessage && (
        <div className="bg-emerald-900 text-white border-b border-emerald-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="font-semibold">{toastMessage.title}</span>
                {toastMessage.detail && (
                  <span className="text-emerald-200 ml-2">{toastMessage.detail}</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {toastMessage.actionLabel && toastMessage.onAction && (
                <button
                  type="button"
                  onClick={() => {
                    toastMessage.onAction?.();
                    setToastMessage(null);
                  }}
                  className="px-3 py-1 bg-white text-slate-900 font-semibold rounded-md hover:bg-emerald-50 transition-colors whitespace-nowrap shrink-0"
                >
                  {toastMessage.actionLabel}
                </button>
              )}
              <button
                type="button"
                onClick={() => setToastMessage(null)}
                className="text-emerald-200 hover:text-white"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
       * CONTENIDO PRINCIPAL POR PÁGINA
       * ================================================================== */}
      <main className="flex-1">
        {/* ------------------------------------------------------------------
         * PÁGINA 1: INICIO
         * ---------------------------------------------------------------- */}
        {activePage === 'inicio' && (
          <div>
            {/* Hero Section con Buscador Destacado */}
            <section className="bg-slate-900 text-white border-b border-slate-800">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
                  {/* Columna izquierda: Propuesta de valor y buscador */}
                  <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      <p className="text-xs font-medium text-emerald-400 tracking-wide">
                        Red de tutorías particulares en Honduras · Tegucigalpa · San Pedro Sula · La
                        Ceiba
                      </p>
                      <h1
                        className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-[1.12]"
                        style={{ textWrap: 'balance' }}
                      >
                        Aprende con tutores hondureños verificados en cada materia
                      </h1>
                      <p className="text-base text-slate-300 leading-relaxed max-w-2xl">
                        Conectamos estudiantes universitarios, padres de familia y profesionales con
                        catedráticos e instructores validados para clases virtuales o presenciales.
                        Reserva por hora en Lempiras con pago protegido.
                      </p>
                    </div>

                    {/* Buscador destacado funcional */}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        navigateTo('explorar');
                      }}
                      className="bg-white p-3 rounded-xl border border-slate-200 shadow-lg text-slate-900 grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center"
                    >
                      <div className="sm:col-span-5 flex items-center gap-2.5 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200">
                        <Search className="w-4 h-4 text-slate-400 shrink-0" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Materia, tema o nombre (ej. Cálculo, TOEFL)"
                          className="w-full text-xs bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none"
                        />
                      </div>

                      <div className="sm:col-span-4 flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200">
                        <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                        <select
                          value={selectedCity}
                          onChange={(e) => setSelectedCity(e.target.value)}
                          className="w-full text-xs bg-transparent text-slate-900 focus:outline-none"
                        >
                          <option value="Todas">Toda Honduras (5 ciudades)</option>
                          {HONDURAS_CITIES.map((city) => (
                            <option key={city} value={city}>
                              {city}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="sm:col-span-3">
                        <button
                          type="submit"
                          className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0"
                        >
                          <span>Buscar tutor</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </form>

                    {/* Búsquedas frecuentes rápidas */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
                      <span className="text-slate-400">Frecuentes:</span>
                      {[
                        'Cálculo UNAH',
                        'TOEFL iBT',
                        'Python',
                        'Química Orgánica',
                        'Contabilidad',
                      ].map((quickTerm) => (
                        <button
                          key={quickTerm}
                          type="button"
                          onClick={() => {
                            setSearchQuery(quickTerm.split(' ')[0]);
                            navigateTo('explorar');
                          }}
                          className="text-xs text-slate-200 hover:text-emerald-400 underline underline-offset-4 transition-colors"
                        >
                          {quickTerm}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Columna derecha: Tarjeta destacada de tutor en vivo */}
                  <div className="lg:col-span-5 bg-slate-800/90 border border-slate-700 rounded-2xl p-6 flex flex-col justify-between space-y-5">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-xs text-slate-300 border-b border-slate-700 pb-3">
                        <span className="font-semibold text-emerald-400">
                          Tutora verificada destacada
                        </span>
                        <span className="font-mono tabular-nums">
                          UNAH · Tegucigalpa · Híbrido
                        </span>
                      </div>

                      <div className="flex items-start gap-4">
                        <TutorPortrait
                          src={tutors[0].portraitUrl}
                          name={tutors[0].name}
                          initials={tutors[0].initials}
                          accentHex={tutors[0].accentHex}
                          sizeClass="w-16 h-16"
                          roundedClass="rounded-xl"
                        />
                        <div>
                          <h2 className="text-lg font-bold text-white">{tutors[0].name}</h2>
                          <p className="text-xs text-slate-300 mt-0.5">{tutors[0].headline}</p>
                          <div className="flex items-center gap-2 text-xs text-amber-400 mt-2 font-mono tabular-nums">
                            <Star className="w-3.5 h-3.5 fill-amber-400" />
                            <span>
                              {tutors[0].rating.toFixed(1)} ({tutors[0].reviewCount} reseñas) ·{' '}
                              {tutors[0].completedSessions} sesiones
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        &ldquo;Preparamos tus exámenes parciales de Cálculo I-III, Ecuaciones
                        Diferenciales y la PAA con guías reales y seguimiento personalizado.&rdquo;
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-700 flex items-center justify-between gap-3">
                      <div>
                        <span className="text-xs text-slate-400 block">Tarifa por hora</span>
                        <span className="text-lg font-bold font-mono tabular-nums text-white">
                          L. {tutors[0].hourlyRateHnl} / hora
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenProfile(tutors[0].id)}
                          className="px-3.5 py-2 text-xs font-semibold text-slate-200 hover:text-white border border-slate-600 hover:border-slate-400 rounded-lg transition-colors whitespace-nowrap shrink-0"
                        >
                          Ver perfil
                        </button>
                        <button
                          type="button"
                          onClick={() => setBookingTutor(tutors[0])}
                          className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-600 rounded-lg transition-colors whitespace-nowrap shrink-0"
                        >
                          Solicitar tutoría
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Franja de indicadores de alcance en ancho completo debajo del split */}
                <div className="mt-10 pt-8 border-t border-slate-800 grid grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <span className="text-2xl font-bold font-mono tabular-nums text-white block">
                      {tutors.filter((t) => t.verificationStatus === 'verificado').length} de{' '}
                      {tutors.length}
                    </span>
                    <span className="text-xs text-slate-400 mt-1 block">
                      Tutores con credenciales verificadas en catálogo activo
                    </span>
                  </div>
                  <div>
                    <span className="text-2xl font-bold font-mono tabular-nums text-white block">
                      L. 280 – L. 450
                    </span>
                    <span className="text-xs text-slate-400 mt-1 block">
                      Rango transparente por hora en Lempiras sin mensualidades
                    </span>
                  </div>
                  <div>
                    <span className="text-2xl font-bold font-mono tabular-nums text-white block">
                      5 Ciudades
                    </span>
                    <span className="text-xs text-slate-400 mt-1 block">
                      Cobertura en Tegucigalpa, San Pedro Sula, La Ceiba, Comayagua y Choluteca
                    </span>
                  </div>
                  <div>
                    <span className="text-2xl font-bold font-mono tabular-nums text-emerald-400 block">
                      10% Comisión
                    </span>
                    <span className="text-xs text-slate-400 mt-1 block">
                      Garantía académica, verificación documental y soporte por sesión
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Sección 2: Materias populares */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-6">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold text-emerald-700">
                    Áreas académicas de mayor demanda
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
                    Explora por materia o nivel educativo
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    resetCatalogFilters();
                    navigateTo('explorar');
                  }}
                  className="text-xs font-semibold text-slate-700 hover:text-slate-900 inline-flex items-center gap-1.5 underline underline-offset-4 whitespace-nowrap shrink-0"
                >
                  <span>Ver todas las especialidades</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {SUBJECT_CATEGORIES.map((subject, idx) => (
                  <button
                    key={subject.name}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(subject.name);
                      navigateTo('explorar');
                    }}
                    className="text-left bg-white border border-slate-200 hover:border-slate-900 rounded-xl p-5 transition-colors flex flex-col justify-between gap-4 group"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="font-mono">0{idx + 1}. Área académica</span>
                        <span className="font-mono tabular-nums font-medium text-slate-700">
                          {subject.tutorCount} tutores
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {subject.name}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {subject.demandSummary}
                      </p>
                    </div>
                    <div className="text-xs font-semibold text-emerald-700 inline-flex items-center gap-1">
                      <span>Filtrar tutores de {subject.shortLabel}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* Sección 3: Tutores recomendados */}
            <section className="bg-white border-y border-slate-200 py-14">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold text-emerald-700">
                      Perfiles mejor evaluados por estudiantes y padres
                    </p>
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
                      Tutores recomendados en Honduras
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigateTo('explorar')}
                    className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0"
                  >
                    Explorar catálogo completo ({tutors.length})
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {tutors.slice(0, 4).map((tutor) => (
                    <TutorCard
                      key={tutor.id}
                      tutor={tutor}
                      onOpenProfile={handleOpenProfile}
                      onRequestTutoring={(t) => setBookingTutor(t)}
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* Sección 4: Cómo funciona y Evidencia de Impacto (Claim-to-Proof Adjacency) */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-5 space-y-4">
                  <p className="text-xs font-semibold text-emerald-700">
                    Proceso transparente de principio a fin
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                    Contratación segura en tres pasos verificables
                  </h2>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    En TutorHn nunca pagas a ciegas. Revisamos los títulos académicos de cada
                    instructor y habilitamos el canal directo de mensajería en cuanto el tutor
                    confirma tu horario.
                  </p>
                  <div className="pt-2 space-y-4">
                    <div className="p-4 bg-white border border-slate-200 rounded-xl">
                      <h3 className="text-sm font-bold text-slate-900">
                        01. Elige tutor, fecha y modalidad
                      </h3>
                      <p className="text-xs text-slate-600 mt-1">
                        Filtra por materia, ciudad en Honduras y presupuesto por hora. Consulta la
                        disponibilidad real antes de solicitar.
                      </p>
                    </div>
                    <div className="p-4 bg-white border border-slate-200 rounded-xl">
                      <h3 className="text-sm font-bold text-slate-900">
                        02. Reserva con pago simulado en garantía
                      </h3>
                      <p className="text-xs text-slate-600 mt-1">
                        Conoces desde el primer momento la tarifa del tutor y el 10% de comisión de
                        plataforma. Si el tutor rechaza la solicitud, no se realiza ningún cobro.
                      </p>
                    </div>
                    <div className="p-4 bg-white border border-slate-200 rounded-xl">
                      <h3 className="text-sm font-bold text-slate-900">
                        03. Confirmación y chat directo
                      </h3>
                      <p className="text-xs text-slate-600 mt-1">
                        Al aceptar el tutor tu solicitud desde su panel, se activa la conversación
                        directa para compartir guías de estudio y enlaces de clase.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Testimonios atribuibles con resultados medibles */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-900">
                      Resultados comprobados por estudiantes y familias hondureñas
                    </h3>
                    <span className="text-xs text-slate-500 font-mono tabular-nums">
                      Calificación media: 4.9 / 5.0
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {reviews.slice(0, 3).map((rev) => {
                      const relatedTutor = tutors.find((t) => t.id === rev.tutorId);
                      return (
                        <div
                          key={rev.id}
                          className="bg-white border border-slate-200 rounded-xl p-5 space-y-3"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                            <span className="font-semibold text-emerald-800">
                              Resultado: {rev.outcome}
                            </span>
                            <span className="font-mono tabular-nums text-slate-500">
                              {rev.date} · {rev.subject}
                            </span>
                          </div>
                          <p className="text-xs text-slate-700 leading-relaxed">
                            &ldquo;{rev.comment}&rdquo;
                          </p>
                          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                            <div>
                              <span className="font-bold text-slate-900">{rev.authorName}</span>
                              <span className="text-slate-500"> · {rev.authorRole}</span>
                            </div>
                            {relatedTutor && (
                              <button
                                type="button"
                                onClick={() => handleOpenProfile(relatedTutor.id)}
                                className="font-semibold text-slate-700 hover:text-emerald-700 underline"
                              >
                                Tutoría con {relatedTutor.name}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>

            {/* Sección 5: Llamada a la acción final */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
              <div className="bg-slate-900 text-white rounded-2xl p-8 sm:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="space-y-2 max-w-2xl">
                  <h2 className="text-2xl font-bold tracking-tight">
                    ¿Listo para reforzar tus clases o enseñar como tutor particular?
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Explora el catálogo completo de tutores verificados o registra tu perfil docente
                    para recibir solicitudes de estudiantes en toda Honduras.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => navigateTo('explorar')}
                    className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0"
                  >
                    Buscar un tutor ahora
                  </button>
                  <button
                    type="button"
                    onClick={() => navigateTo('acceso')}
                    className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0"
                  >
                    Registrarme como tutor
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ------------------------------------------------------------------
         * PÁGINA 2: EXPLORAR TUTORES (CATÁLOGO Y FILTROS)
         * ---------------------------------------------------------------- */}
        {activePage === 'explorar' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-5">
              <div>
                <p className="text-xs font-medium text-slate-500">
                  Catálogo nacional · Precios por hora en Lempiras (L.)
                </p>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
                  Explorar tutores particulares en Honduras
                </h1>
              </div>
              <div className="text-xs text-slate-600 font-mono tabular-nums">
                Mostrando <strong>{filteredTutors.length}</strong> de {tutors.length} tutores
              </div>
            </div>

            {/* Panel de Filtros Funcionales */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                {/* Búsqueda por palabra clave */}
                <div className="md:col-span-4">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Buscar por materia, tema o nombre
                  </label>
                  <div className="relative flex items-center">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Ej. Cálculo, Python, TOEFL, Química..."
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:border-slate-900"
                    />
                  </div>
                </div>

                {/* Filtro por materia */}
                <div className="md:col-span-3">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Materia principal
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:border-slate-900"
                  >
                    <option value="Todas">Todas las materias</option>
                    {SUBJECT_CATEGORIES.map((cat) => (
                      <option key={cat.name} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Filtro por zona / ciudad */}
                <div className="md:col-span-3">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Zona / Ciudad
                  </label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:border-slate-900"
                  >
                    <option value="Todas">Todas las ciudades</option>
                    {HONDURAS_CITIES.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Filtro por precio máximo por hora */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Precio máx. / hora
                  </label>
                  <select
                    value={maxPriceHnl}
                    onChange={(e) => setMaxPriceHnl(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-mono tabular-nums bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:border-slate-900"
                  >
                    <option value={600}>Hasta L. 600 / h</option>
                    <option value={450}>Hasta L. 450 / h</option>
                    <option value={380}>Hasta L. 380 / h</option>
                    <option value={320}>Hasta L. 320 / h</option>
                  </select>
                </div>
              </div>

              {/* Segunda fila de filtros: Modalidad + Solo verificados + Orden + Limpiar */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs font-semibold text-slate-700">Modalidad:</span>
                  <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
                    {['Todas', 'Virtual', 'Presencial', 'Híbrido'].map((mod) => (
                      <button
                        key={mod}
                        type="button"
                        onClick={() => setSelectedModality(mod)}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                          selectedModality === mod
                            ? 'bg-white text-slate-900 shadow-xs font-semibold'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {mod}
                      </button>
                    ))}
                  </div>

                  <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer select-none ml-2">
                    <input
                      type="checkbox"
                      checked={onlyVerified}
                      onChange={(e) => setOnlyVerified(e.target.checked)}
                      className="rounded accent-emerald-700"
                    />
                    <span>Solo tutores verificados</span>
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-slate-500">Ordenar:</span>
                    <select
                      value={sortBy}
                      onChange={(e) =>
                        setSortBy(e.target.value as 'rating' | 'price-asc' | 'experience')
                      }
                      className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-md text-xs font-medium text-slate-800"
                    >
                      <option value="rating">Mejor calificados</option>
                      <option value="price-asc">Menor precio por hora</option>
                      <option value="experience">Mayor experiencia</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={resetCatalogFilters}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900 inline-flex items-center gap-1 underline whitespace-nowrap shrink-0"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Limpiar filtros</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Resultados del catálogo o Estado vacío */}
            {filteredTutors.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-xl p-12 text-center max-w-lg mx-auto my-6 space-y-4">
                <SlidersHorizontal className="w-8 h-8 text-slate-400 mx-auto" />
                <h2 className="text-lg font-bold text-slate-900">
                  No encontramos tutores con esos filtros exactos
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Prueba ampliando el rango de precio por hora en Lempiras o seleccionando
                  &ldquo;Todas las ciudades&rdquo; para ver tutores con modalidad virtual.
                </p>
                <button
                  type="button"
                  onClick={resetCatalogFilters}
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  Restablecer todos los filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredTutors.map((tutor) => (
                  <TutorCard
                    key={tutor.id}
                    tutor={tutor}
                    onOpenProfile={handleOpenProfile}
                    onRequestTutoring={(t) => setBookingTutor(t)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------------
         * PÁGINA 3: PERFIL DEL TUTOR
         * ---------------------------------------------------------------- */}
        {activePage === 'perfil' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            {/* Navegación de regreso */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => navigateTo('explorar')}
                className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver al catálogo de tutores</span>
              </button>

              <div className="flex items-center gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => navigateTo('verificacion')}
                  className="text-slate-600 hover:text-slate-900 underline"
                >
                  Cambiar estado en Verificación de Tutores
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Columna Principal (Información académica, disponibilidad y reseñas) */}
              <div className="lg:col-span-8 space-y-6">
                {/* Encabezado del Perfil */}
                <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
                  <div className="flex flex-col sm:flex-row items-start gap-5">
                    <TutorPortrait
                      src={selectedTutor.portraitUrl}
                      name={selectedTutor.name}
                      initials={selectedTutor.initials}
                      accentHex={selectedTutor.accentHex}
                      sizeClass="w-24 h-24"
                      roundedClass="rounded-2xl"
                    />
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span className="font-semibold text-slate-700">
                          {selectedTutor.category}
                        </span>
                        <span>·</span>
                        <VerificationLabel status={selectedTutor.verificationStatus} />
                        <span>·</span>
                        <span>{selectedTutor.responseTime}</span>
                      </div>

                      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                        {selectedTutor.name}
                      </h1>
                      <p className="text-sm text-slate-700 font-medium">
                        {selectedTutor.headline}
                      </p>

                      <div className="pt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600">
                        <span className="inline-flex items-center gap-1 font-semibold text-slate-900">
                          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                          <span className="font-mono tabular-nums">
                            {selectedTutor.rating.toFixed(1)}
                          </span>
                          <span className="font-normal text-slate-500 tabular-nums">
                            ({selectedTutor.reviewCount} reseñas)
                          </span>
                        </span>
                        <span>·</span>
                        <span>
                          {selectedTutor.city} ({selectedTutor.zoneDetail})
                        </span>
                        <span>·</span>
                        <span>Modalidad {selectedTutor.modality}</span>
                        <span>·</span>
                        <span className="font-mono tabular-nums">
                          {selectedTutor.yearsExperience} años de experiencia
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Nota de verificación oficial */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-4 text-xs">
                    <div className="space-y-0.5">
                      <p className="font-semibold text-slate-900">
                        Estado en Comité de Verificación TutorHn:
                      </p>
                      <p className="text-slate-600">{selectedTutor.verificationNote}</p>
                    </div>
                    <span className="font-mono tabular-nums text-slate-500 shrink-0">
                      {selectedTutor.completedSessions} clases impartidas
                    </span>
                  </div>

                  {/* Presentación y Metodología */}
                  <div className="space-y-4 pt-2 border-t border-slate-100">
                    <div>
                      <h2 className="text-base font-bold text-slate-900">
                        Sobre {selectedTutor.name}
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-1.5">
                        {selectedTutor.bio}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Metodología de clase</h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-1">
                        {selectedTutor.methodology}
                      </p>
                    </div>
                  </div>

                  {/* Especialidades y Credenciales */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 mb-2">
                        Materias y temas que imparte
                      </h3>
                      <ul className="space-y-1.5 text-xs text-slate-700">
                        {selectedTutor.specialties.map((spec) => (
                          <li key={spec} className="flex items-center gap-2">
                            <span className="text-emerald-700 font-bold">·</span>
                            <span>{spec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xs font-bold text-slate-900 mb-2">
                        Formación y credenciales
                      </h3>
                      <ul className="space-y-1.5 text-xs text-slate-700">
                        {selectedTutor.credentials.map((cred) => (
                          <li key={cred} className="flex items-center gap-2">
                            <span className="text-emerald-700 font-bold">·</span>
                            <span>{cred}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Disponibilidad semanal interactiva */}
                <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h2 className="text-base font-bold text-slate-900">
                        Disponibilidad semanal de ejemplo
                      </h2>
                      <p className="text-xs text-slate-600">
                        Haz clic en cualquier bloque horario para abrir la solicitud de tutoría.
                      </p>
                    </div>
                    <span className="text-xs text-slate-500">Hora oficial de Honduras (GMT-6)</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    {selectedTutor.availability.map((slot) => (
                      <div
                        key={slot.day}
                        className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5"
                      >
                        <p className="text-xs font-bold text-slate-900">{slot.day}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {slot.hours.map((hr) => (
                            <button
                              key={hr}
                              type="button"
                              onClick={() => setBookingTutor(selectedTutor)}
                              className="px-2.5 py-1 text-xs font-mono tabular-nums bg-white border border-slate-300 hover:border-emerald-700 hover:text-emerald-700 rounded-md transition-colors"
                            >
                              {hr}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Reseñas verificadas y formulario para agregar reseña */}
                <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                    <div>
                      <h2 className="text-base font-bold text-slate-900">
                        Reseñas y resultados de estudiantes ({selectedTutorReviews.length})
                      </h2>
                      <p className="text-xs text-slate-600">
                        Opiniones vinculadas a tutorías impartidas por {selectedTutor.name}.
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm font-bold font-mono tabular-nums text-slate-900">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <span>{selectedTutor.rating.toFixed(1)} / 5.0</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {selectedTutorReviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                          <span className="font-bold text-slate-900">
                            {rev.authorName}{' '}
                            <span className="font-normal text-slate-500">· {rev.authorRole}</span>
                          </span>
                          <span className="font-mono tabular-nums text-slate-500">
                            {'★'.repeat(rev.rating)} · {rev.date}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-emerald-800">
                          Materia: {rev.subject} · Logro: {rev.outcome}
                        </p>
                        <p className="text-xs text-slate-700 leading-relaxed">
                          &ldquo;{rev.comment}&rdquo;
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Formulario interactivo para publicar reseña de demostración */}
                  <form
                    onSubmit={(e) => handleAddReview(e, selectedTutor.id)}
                    className="pt-4 border-t border-slate-200 space-y-3"
                  >
                    <h3 className="text-xs font-bold text-slate-900">
                      Agregar una reseña de demostración para {selectedTutor.name}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input
                        type="text"
                        value={newReviewSubject}
                        onChange={(e) => setNewReviewSubject(e.target.value)}
                        placeholder="Materia cursada (ej. Cálculo I)"
                        className="px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                      />
                      <input
                        type="text"
                        value={newReviewOutcome}
                        onChange={(e) => setNewReviewOutcome(e.target.value)}
                        placeholder="Resultado logrado (ej. Aprobé el parcial con 90%)"
                        className="px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                      />
                      <select
                        value={newReviewRating}
                        onChange={(e) => setNewReviewRating(Number(e.target.value))}
                        className="px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                      >
                        <option value={5}>Calificación: 5.0 ★ (Excelente)</option>
                        <option value={4}>Calificación: 4.0 ★ (Muy bueno)</option>
                      </select>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2.5">
                      <input
                        type="text"
                        value={newReviewComment}
                        onChange={(e) => setNewReviewComment(e.target.value)}
                        placeholder="Escribe tu experiencia con la metodología del tutor..."
                        className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0"
                      >
                        Publicar reseña
                      </button>
                    </div>
                  </form>
                </section>
              </div>

              {/* Columna Derecha: Tarjeta de Contratación y Garantía */}
              <aside className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 space-y-5 lg:sticky lg:top-24">
                <div className="flex items-baseline justify-between border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-xs text-slate-500 block">Tarifa por hora</span>
                    <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
                      L. {selectedTutor.hourlyRateHnl}.00
                    </span>
                  </div>
                  <VerificationLabel status={selectedTutor.verificationStatus} />
                </div>

                <div className="space-y-2.5 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span>Modalidad disponible</span>
                    <span className="font-semibold text-slate-900">{selectedTutor.modality}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Ubicación</span>
                    <span className="font-semibold text-slate-900">{selectedTutor.city}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Comisión de plataforma</span>
                    <span className="font-mono tabular-nums font-semibold text-slate-900">
                      10% (L. {Math.round(selectedTutor.hourlyRateHnl * 0.1)} / h)
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setBookingTutor(selectedTutor)}
                  className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 whitespace-nowrap shrink-0"
                >
                  <CalendarPlus className="w-4 h-4" />
                  <span>Solicitar tutoría ahora</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setManagedTutorId(selectedTutor.id);
                    navigateTo('panel-tutor');
                  }}
                  className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  Abrir Panel de Tutor de {selectedTutor.name.split(' ')[1] || selectedTutor.name}
                </button>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                  <p className="font-semibold text-slate-900">Garantía TutorHn</p>
                  <p>
                    Al solicitar la tutoría, podrás elegir fecha, hora y confirmar el pago simulado.
                    Una vez aceptada la solicitud, se habilita el chat directo.
                  </p>
                </div>
              </aside>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------
         * PÁGINA 4: SOLICITUDES Y CONTRATACIONES (VISTA ESTUDIANTE / PADRE)
         * ---------------------------------------------------------------- */}
        {activePage === 'solicitudes' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-5">
              <div>
                <p className="text-xs font-medium text-slate-500">
                  Historial de sesiones y pagos en custodia · {currentUser.name}
                </p>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
                  Solicitudes y contrataciones
                </h1>
              </div>

              <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg">
                {(
                  [
                    ['todas', `Todas (${requests.length})`],
                    [
                      'pendiente',
                      `Pendientes (${requests.filter((r) => r.status === 'pendiente').length})`,
                    ],
                    [
                      'aceptada',
                      `Aceptadas (${requests.filter((r) => r.status === 'aceptada').length})`,
                    ],
                    [
                      'rechazada',
                      `Rechazadas (${requests.filter((r) => r.status === 'rechazada').length})`,
                    ],
                  ] as const
                ).map(([st, label]) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setRequestStatusFilter(st)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                      requestStatusFilter === st
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {requests
                .filter((r) =>
                  requestStatusFilter === 'todas' ? true : r.status === requestStatusFilter
                )
                .map((req) => (
                  <div
                    key={req.id}
                    className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5"
                  >
                    <div className="flex items-start gap-4 max-w-2xl">
                      <TutorPortrait
                        src={req.tutorPortraitUrl}
                        name={req.tutorName}
                        initials={req.tutorName.slice(0, 2).toUpperCase()}
                        sizeClass="w-14 h-14"
                        roundedClass="rounded-xl"
                      />
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className="font-mono font-semibold text-slate-500">#{req.id}</span>
                          <span>·</span>
                          <span className="text-slate-500">{req.createdAt}</span>
                          <span>·</span>
                          {req.status === 'pendiente' && (
                            <span className="inline-flex items-center gap-1 font-semibold text-amber-700">
                              <Clock className="w-3.5 h-3.5" />
                              <span>Pendiente de aceptación del tutor</span>
                            </span>
                          )}
                          {req.status === 'aceptada' && (
                            <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Tutoría Aceptada — Conversación activa</span>
                            </span>
                          )}
                          {req.status === 'rechazada' && (
                            <span className="inline-flex items-center gap-1 font-semibold text-red-700">
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Solicitud Rechazada — Reembolso simulado</span>
                            </span>
                          )}
                        </div>

                        <h2 className="text-base font-bold text-slate-900">
                          {req.subject} con{' '}
                          <button
                            type="button"
                            onClick={() => handleOpenProfile(req.tutorId)}
                            className="underline hover:text-emerald-700"
                          >
                            {req.tutorName}
                          </button>
                        </h2>

                        <p className="text-xs text-slate-600">
                          Fecha programada: <strong>{req.date}</strong> a las{' '}
                          <span className="font-mono tabular-nums">{req.timeSlot}</span> hrs ·
                          Modalidad {req.modality} ({req.durationHours} h)
                        </p>

                        <p className="text-xs text-slate-500">
                          Notas: &ldquo;{req.topicNotes}&rdquo;
                        </p>

                        <div className="pt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono tabular-nums text-slate-600">
                          <span>Tutoría: L. {req.subtotalHnl}.00</span>
                          <span>·</span>
                          <span>Comisión TutorHn (10%): L. {req.platformFeeHnl}.00</span>
                          <span>·</span>
                          <span className="font-bold text-slate-900">
                            Total pagado (Demo): L. {req.totalPaidHnl}.00
                          </span>
                          <span>·</span>
                          <span className="text-slate-400">Ref: {req.paymentReference}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full lg:w-auto justify-end border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100">
                      {req.status === 'pendiente' && (
                        <button
                          type="button"
                          onClick={() => {
                            setManagedTutorId(req.tutorId);
                            navigateTo('panel-tutor');
                          }}
                          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
                        >
                          <span>Aceptar desde Panel de Tutor (Demo)</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {req.status === 'aceptada' && (
                        <button
                          type="button"
                          onClick={() => {
                            const conv = conversations.find((c) => c.requestId === req.id);
                            if (conv) setActiveConversationId(conv.id);
                            navigateTo('mensajes');
                          }}
                          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Abrir conversación en Mensajes</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleOpenProfile(req.tutorId)}
                        className="px-3.5 py-2 border border-slate-300 hover:border-slate-900 text-slate-700 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0"
                      >
                        Ver tutor
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------
         * PÁGINA 5: MENSAJES (CHAT DE DEMOSTRACIÓN)
         * ---------------------------------------------------------------- */}
        {activePage === 'mensajes' && (
          <MessagesView
            conversations={conversations}
            requests={requests}
            activeConversationId={activeConversationId}
            onSelectConversation={(id) => setActiveConversationId(id)}
            onSendMessage={handleSendMessage}
            onSimulateTutorReply={handleSimulateTutorReply}
            onOpenTutorProfile={handleOpenProfile}
            onGoToTutorPanel={(tutorId) => {
              if (tutorId) setManagedTutorId(tutorId);
              navigateTo('panel-tutor');
            }}
            onGoToExplore={() => navigateTo('explorar')}
          />
        )}

        {/* ------------------------------------------------------------------
         * PÁGINA 6: ACCESO Y REGISTRO
         * ---------------------------------------------------------------- */}
        {activePage === 'acceso' && (
          <AuthView
            currentUser={currentUser}
            onSelectUser={(user) => {
              setCurrentUser(user);
              if (user.linkedTutorId) {
                setManagedTutorId(user.linkedTutorId);
              }
              showNotification(
                `Sesión iniciada como ${user.name}`,
                `Rol activo: ${user.role.toUpperCase()} (${user.city})`
              );
            }}
            onRegisterNewTutor={handleRegisterNewTutor}
          />
        )}

        {/* ------------------------------------------------------------------
         * PÁGINA 7: PANEL DE TUTOR
         * ---------------------------------------------------------------- */}
        {activePage === 'panel-tutor' && (
          <TutorPanelView
            tutors={tutors}
            requests={requests}
            managedTutorId={managedTutorId}
            onSelectManagedTutor={(id) => setManagedTutorId(id)}
            onAcceptRequest={handleAcceptRequest}
            onRejectRequest={handleRejectRequest}
            onOpenChatForRequest={(reqId) => {
              const conv = conversations.find((c) => c.requestId === reqId);
              if (conv) setActiveConversationId(conv.id);
              navigateTo('mensajes');
            }}
            onUpdateTutorRate={handleUpdateTutorRate}
            onGoToVerification={() => navigateTo('verificacion')}
          />
        )}

        {/* ------------------------------------------------------------------
         * PÁGINA 8: VERIFICACIÓN DE TUTORES
         * ---------------------------------------------------------------- */}
        {activePage === 'verificacion' && (
          <VerificationPanelView
            tutors={tutors}
            onChangeVerification={handleChangeVerification}
            onOpenTutorProfile={handleOpenProfile}
          />
        )}
      </main>

      {/* ====================================================================
       * MODAL DE CONTRATACIÓN Y PAGO SIMULADO
       * ================================================================== */}
      {bookingTutor && (
        <BookingModal
          tutor={bookingTutor}
          currentUser={currentUser}
          onClose={() => setBookingTutor(null)}
          onConfirmBooking={handleConfirmBooking}
          onGoToRequests={() => {
            setBookingTutor(null);
            navigateTo('solicitudes');
          }}
          onGoToTutorPanel={(tutorId) => {
            setBookingTutor(null);
            setManagedTutorId(tutorId);
            navigateTo('panel-tutor');
          }}
        />
      )}

      {/* ====================================================================
       * PIE DE PÁGINA LIMPIO Y NAVEGABLE
       * ================================================================== */}
      <footer className="bg-white border-t border-slate-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-xs text-slate-600">
          <div className="space-y-1">
            <span className="text-base font-bold text-slate-900 font-display">TutorHn</span>
            <p className="text-xs text-slate-500">
              Marketplace educativo para Honduras · Primera versión funcional de demostración.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => navigateTo('inicio')}
              className="hover:text-slate-900"
            >
              Inicio
            </button>
            <button
              type="button"
              onClick={() => navigateTo('explorar')}
              className="hover:text-slate-900"
            >
              Explorar tutores
            </button>
            <button
              type="button"
              onClick={() => navigateTo('solicitudes')}
              className="hover:text-slate-900"
            >
              Solicitudes
            </button>
            <button
              type="button"
              onClick={() => navigateTo('mensajes')}
              className="hover:text-slate-900"
            >
              Mensajes
            </button>
            <button
              type="button"
              onClick={() => navigateTo('panel-tutor')}
              className="hover:text-slate-900"
            >
              Panel de tutor
            </button>
            <button
              type="button"
              onClick={() => navigateTo('verificacion')}
              className="hover:text-slate-900"
            >
              Verificación de tutores
            </button>
            <button
              type="button"
              onClick={() => navigateTo('acceso')}
              className="hover:text-slate-900"
            >
              Acceso y registro
            </button>
            <span className="text-slate-300">|</span>
            <button
              type="button"
              onClick={handleResetDemo}
              className="text-emerald-700 hover:text-emerald-900 font-semibold inline-flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restaurar datos de la demo</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
