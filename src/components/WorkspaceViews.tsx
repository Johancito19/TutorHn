import React, { useState } from 'react';
import {
  Send,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  AlertTriangle,
  UserCheck,
  ArrowRight,
  Sparkles,
  Calendar,
  MapPin,
  Lock,
  Check,
} from 'lucide-react';
import {
  Tutor,
  TutoringRequest,
  Conversation,
  VerificationStatus,
  CurrentUser,
  SubjectCategory,
  HondurasCity,
  Modality,
} from '../types';
import { TutorPortrait } from './TutorPortrait';
import { VerificationLabel } from './TutorCard';
import { HONDURAS_CITIES, SUBJECT_CATEGORIES } from '../data/mockData';

/* ============================================================================
 * 1. VISTA DE MENSAJES (CHAT DE DEMOSTRACIÓN)
 * ========================================================================== */
interface MessagesViewProps {
  conversations: Conversation[];
  requests: TutoringRequest[];
  activeConversationId: string | null;
  onSelectConversation: (convId: string) => void;
  onSendMessage: (convId: string, text: string) => void;
  onSimulateTutorReply: (convId: string) => void;
  onOpenTutorProfile: (tutorId: string) => void;
  onGoToTutorPanel: (tutorId?: string) => void;
  onGoToExplore: () => void;
}

export const MessagesView: React.FC<MessagesViewProps> = ({
  conversations,
  requests,
  activeConversationId,
  onSelectConversation,
  onSendMessage,
  onSimulateTutorReply,
  onOpenTutorProfile,
  onGoToTutorPanel,
  onGoToExplore,
}) => {
  const [draftText, setDraftText] = useState('');

  const selectedConv =
    conversations.find((c) => c.id === activeConversationId) || conversations[0] || null;

  const pendingRequests = requests.filter((r) => r.status === 'pendiente');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConv || !draftText.trim()) return;
    onSendMessage(selectedConv.id, draftText.trim());
    setDraftText('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <p className="text-xs font-medium text-slate-500">
            Comunicación directa estudiante-tutor
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
            Mensajes y coordinación de tutorías
          </h1>
        </div>
        <p className="text-xs text-slate-600 max-w-md">
          Las conversaciones se habilitan automáticamente cuando un tutor acepta una solicitud de
          tutoría desde su panel.
        </p>
      </div>

      {/* Aviso si existen solicitudes pendientes por aceptar */}
      {pendingRequests.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-50/90 border border-amber-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-950">
              <p className="font-semibold">
                Tienes {pendingRequests.length}{' '}
                {pendingRequests.length === 1
                  ? 'solicitud pendiente de aceptación'
                  : 'solicitudes pendientes de aceptación'}
              </p>
              <p className="text-amber-800 mt-0.5">
                Para habilitar el chat con{' '}
                <strong>{pendingRequests[0].tutorName}</strong> ({pendingRequests[0].subject}),
                acepta la solicitud desde el Panel de Tutor.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onGoToTutorPanel(pendingRequests[0].tutorId)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <span>Ir al Panel de Tutor para aceptar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {conversations.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-10 text-center max-w-xl mx-auto my-8 space-y-4">
          <MessageSquare className="w-10 h-10 text-slate-400 mx-auto" />
          <h2 className="text-lg font-bold text-slate-900">
            Aún no hay conversaciones habilitadas
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Solicita una tutoría con cualquier tutor del catálogo y acéptala desde el Panel de Tutor
            para abrir el canal de mensajería de demostración.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={onGoToExplore}
              className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              Explorar tutores
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Lista lateral de conversaciones */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-4 py-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-800">
                Canales activos ({conversations.length})
              </span>
              <span className="text-xs text-emerald-700 font-medium">Tutorías aceptadas</span>
            </div>
            <div className="divide-y divide-slate-100">
              {conversations.map((conv) => {
                const isSelected = selectedConv?.id === conv.id;
                const lastMessage = conv.messages[conv.messages.length - 1];
                return (
                  <button
                    key={conv.id}
                    type="button"
                    onClick={() => onSelectConversation(conv.id)}
                    className={`w-full text-left p-4 transition-colors flex items-start gap-3 ${
                      isSelected ? 'bg-slate-900 text-white' : 'hover:bg-slate-50 text-slate-900'
                    }`}
                  >
                    <TutorPortrait
                      src={conv.tutorPortraitUrl}
                      name={conv.tutorName}
                      initials={conv.tutorName.slice(0, 2).toUpperCase()}
                      sizeClass="w-11 h-11"
                      roundedClass="rounded-lg"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p
                          className={`text-xs font-bold truncate ${
                            isSelected ? 'text-white' : 'text-slate-900'
                          }`}
                        >
                          {conv.tutorName}
                        </p>
                        {lastMessage && (
                          <span
                            className={`text-xs font-mono tabular-nums shrink-0 ${
                              isSelected ? 'text-slate-300' : 'text-slate-400'
                            }`}
                          >
                            {lastMessage.timestamp}
                          </span>
                        )}
                      </div>
                      <p
                        className={`text-xs truncate mt-0.5 ${
                          isSelected ? 'text-emerald-300' : 'text-emerald-700 font-medium'
                        }`}
                      >
                        {conv.subject}
                      </p>
                      {lastMessage && (
                        <p
                          className={`text-xs truncate mt-1 ${
                            isSelected ? 'text-slate-300' : 'text-slate-500'
                          }`}
                        >
                          {lastMessage.text}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Ventana de conversación activa */}
          {selectedConv && (
            <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl flex flex-col overflow-hidden">
              {/* Encabezado del chat */}
              <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <TutorPortrait
                    src={selectedConv.tutorPortraitUrl}
                    name={selectedConv.tutorName}
                    initials={selectedConv.tutorName.slice(0, 2).toUpperCase()}
                    sizeClass="w-11 h-11"
                    roundedClass="rounded-lg"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-bold text-slate-900">
                        {selectedConv.tutorName}
                      </h2>
                      <span className="text-xs text-slate-400">·</span>
                      <span className="text-xs text-emerald-700 font-medium">
                        Sesión confirmada
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {selectedConv.subject} · {selectedConv.scheduledDate} a las{' '}
                      <span className="font-mono tabular-nums">{selectedConv.scheduledTime}</span> (
                      {selectedConv.modality})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onSimulateTutorReply(selectedConv.id)}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:border-slate-900 rounded-lg transition-colors whitespace-nowrap shrink-0"
                  >
                    Simular respuesta del tutor
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenTutorProfile(selectedConv.tutorId)}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 underline whitespace-nowrap shrink-0"
                  >
                    Ver perfil
                  </button>
                </div>
              </div>

              {/* Lista de mensajes */}
              <div className="p-5 space-y-4 min-h-[340px] max-h-[440px] overflow-y-auto bg-slate-50/50">
                {selectedConv.messages.map((msg) => {
                  if (msg.sender === 'sistema') {
                    return (
                      <div
                        key={msg.id}
                        className="p-3 rounded-lg bg-slate-100 border border-slate-200 text-xs text-slate-600 flex items-center justify-between gap-3"
                      >
                        <span>{msg.text}</span>
                        <span className="font-mono tabular-nums text-slate-400 shrink-0">
                          {msg.timestamp}
                        </span>
                      </div>
                    );
                  }

                  const isStudent = msg.sender === 'estudiante';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isStudent ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-2 mb-1 px-1">
                        <span className="text-xs font-semibold text-slate-700">
                          {msg.senderName}
                        </span>
                        <span className="text-xs font-mono tabular-nums text-slate-400">
                          {msg.timestamp}
                        </span>
                      </div>
                      <div
                        className={`max-w-lg rounded-xl px-4 py-3 text-xs leading-relaxed ${
                          isStudent
                            ? 'bg-slate-900 text-white'
                            : 'bg-white border border-slate-200 text-slate-800'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Formulario para enviar nuevo mensaje */}
              <form
                onSubmit={handleSubmit}
                className="p-4 bg-white border-t border-slate-200 flex items-center gap-3"
              >
                <input
                  type="text"
                  value={draftText}
                  onChange={(e) => setDraftText(e.target.value)}
                  placeholder={`Escribe un mensaje para ${selectedConv.tutorName}...`}
                  className="flex-1 px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-2 whitespace-nowrap shrink-0"
                >
                  <span>Enviar mensaje</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* ============================================================================
 * 2. PANEL DE TUTOR (GESTIÓN DE PERFIL Y SOLICITUDES RECIBIDAS)
 * ========================================================================== */
interface TutorPanelViewProps {
  tutors: Tutor[];
  requests: TutoringRequest[];
  managedTutorId: string;
  onSelectManagedTutor: (tutorId: string) => void;
  onAcceptRequest: (requestId: string) => void;
  onRejectRequest: (requestId: string) => void;
  onOpenChatForRequest: (requestId: string) => void;
  onUpdateTutorRate: (tutorId: string, newRate: number) => void;
  onGoToVerification: () => void;
}

export const TutorPanelView: React.FC<TutorPanelViewProps> = ({
  tutors,
  requests,
  managedTutorId,
  onSelectManagedTutor,
  onAcceptRequest,
  onRejectRequest,
  onOpenChatForRequest,
  onUpdateTutorRate,
  onGoToVerification,
}) => {
  const activeTutor = tutors.find((t) => t.id === managedTutorId) || tutors[0];
  const [showAllTutorRequests, setShowAllTutorRequests] = useState<boolean>(false);
  const [rateInput, setRateInput] = useState<string>(String(activeTutor.hourlyRateHnl));

  const handleTutorSwitch = (newTutorId: string) => {
    onSelectManagedTutor(newTutorId);
    const found = tutors.find((t) => t.id === newTutorId);
    if (found) setRateInput(String(found.hourlyRateHnl));
  };

  const tutorRequests = showAllTutorRequests
    ? requests
    : requests.filter((r) => r.tutorId === activeTutor.id);

  const pendingCount = requests.filter(
    (r) => r.tutorId === activeTutor.id && r.status === 'pendiente'
  ).length;
  const acceptedCount = requests.filter(
    (r) => r.tutorId === activeTutor.id && r.status === 'aceptada'
  ).length;
  const netEarningsHnl = requests
    .filter((r) => r.tutorId === activeTutor.id && r.status === 'aceptada')
    .reduce((acc, r) => acc + r.subtotalHnl, 0);

  const handleSaveRate = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = Number(rateInput);
    if (!Number.isNaN(parsed) && parsed >= 100 && parsed <= 2500) {
      onUpdateTutorRate(activeTutor.id, parsed);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Encabezado y selector de tutor en modo demo */}
      <div className="flex flex-wrap items-end justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <p className="text-xs font-medium text-slate-500">
            Espacio de trabajo docente · TutorHn
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
            Panel de gestión del tutor
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="text-xs font-semibold text-slate-600">
            Tutor activo en la demo:
          </label>
          <select
            value={activeTutor.id}
            onChange={(e) => handleTutorSwitch(e.target.value)}
            className="px-3.5 py-2 text-xs font-semibold bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-slate-900"
          >
            {tutors.map((t) => {
              const count = requests.filter(
                (r) => r.tutorId === t.id && r.status === 'pendiente'
              ).length;
              return (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.city}){count > 0 ? ` — ${count} pendiente(s)` : ''}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Resumen de perfil del tutor + KPIs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between gap-5">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <TutorPortrait
              src={activeTutor.portraitUrl}
              name={activeTutor.name}
              initials={activeTutor.initials}
              accentHex={activeTutor.accentHex}
              sizeClass="w-16 h-16"
              roundedClass="rounded-xl"
            />
            <div className="space-y-1 flex-1">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span>{activeTutor.category}</span>
                <span>·</span>
                <VerificationLabel status={activeTutor.verificationStatus} />
              </div>
              <h2 className="text-xl font-bold text-slate-900">{activeTutor.name}</h2>
              <p className="text-xs text-slate-600">{activeTutor.headline}</p>
              <p className="text-xs text-slate-500 pt-1">
                {activeTutor.university} · {activeTutor.city} ({activeTutor.zoneDetail}) · Modalidad{' '}
                {activeTutor.modality}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <form onSubmit={handleSaveRate} className="flex items-center gap-2">
              <label className="text-xs font-semibold text-slate-700">
                Tarifa por hora (L.):
              </label>
              <input
                type="number"
                min={100}
                max={2500}
                value={rateInput}
                onChange={(e) => setRateInput(e.target.value)}
                className="w-24 px-2.5 py-1.5 text-xs font-mono tabular-nums bg-slate-50 border border-slate-300 rounded-md text-slate-900"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0"
              >
                Actualizar tarifa
              </button>
            </form>

            <button
              type="button"
              onClick={onGoToVerification}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 underline whitespace-nowrap shrink-0"
            >
              Ver estado en Verificación de Tutores
            </button>
          </div>
        </div>

        {/* Métricas con números tabulares */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <span className="text-xs text-slate-500 block">Solicitudes pendientes</span>
            <span className="text-2xl font-bold font-mono tabular-nums text-amber-700 mt-1 block">
              {pendingCount}
            </span>
            <span className="text-xs text-slate-500 mt-1 block">
              Requieren tu confirmación
            </span>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <span className="text-xs text-slate-500 block">Tutorías aceptadas</span>
            <span className="text-2xl font-bold font-mono tabular-nums text-emerald-700 mt-1 block">
              {acceptedCount}
            </span>
            <span className="text-xs text-slate-500 mt-1 block">Con chat habilitado</span>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <span className="text-xs text-slate-500 block">Ingresos netos (Demo)</span>
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 mt-1 block">
              L. {netEarningsHnl}
            </span>
            <span className="text-xs text-slate-500 mt-1 block">
              Libre de comisión (10%)
            </span>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <span className="text-xs text-slate-500 block">Calificación y sesiones</span>
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 mt-1 block">
              {activeTutor.rating.toFixed(1)} / 5.0
            </span>
            <span className="text-xs text-slate-500 mt-1 block tabular-nums">
              {activeTutor.completedSessions} sesiones impartidas
            </span>
          </div>
        </div>
      </div>

      {/* Bandeja de solicitudes recibidas */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Solicitudes de tutoría recibidas
            </h2>
            <p className="text-xs text-slate-600">
              Acepta una solicitud pendiente para confirmar la sesión y habilitar la conversación con
              el estudiante.
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              type="button"
              onClick={() => setShowAllTutorRequests(false)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                !showAllTutorRequests
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Solo de {activeTutor.name.split(' ')[1] || activeTutor.name}
            </button>
            <button
              type="button"
              onClick={() => setShowAllTutorRequests(true)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                showAllTutorRequests
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todas las solicitudes ({requests.length})
            </button>
          </div>
        </div>

        {tutorRequests.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center space-y-3">
            <p className="text-sm font-semibold text-slate-900">
              Este tutor no tiene solicitudes registradas en este momento.
            </p>
            <p className="text-xs text-slate-600">
              Puedes cambiar a &ldquo;Todas las solicitudes&rdquo; arriba o solicitar una tutoría
              desde el catálogo.
            </p>
            <button
              type="button"
              onClick={() => setShowAllTutorRequests(true)}
              className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg"
            >
              Mostrar todas las solicitudes de la demo ({requests.length})
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {tutorRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5"
              >
                <div className="space-y-2 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-mono font-semibold text-slate-500">#{req.id}</span>
                    <span>·</span>
                    <span className="font-semibold text-slate-800">
                      Estudiante: {req.studentName} ({req.studentRole})
                    </span>
                    <span>·</span>
                    <span className="text-slate-500">Tutor: {req.tutorName}</span>
                    <span>·</span>
                    {req.status === 'pendiente' && (
                      <span className="inline-flex items-center gap-1 font-semibold text-amber-700">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Pendiente de respuesta</span>
                      </span>
                    )}
                    {req.status === 'aceptada' && (
                      <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Aceptada — Chat activo</span>
                      </span>
                    )}
                    {req.status === 'rechazada' && (
                      <span className="inline-flex items-center gap-1 font-semibold text-red-700">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Rechazada</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900">
                    {req.subject} — {req.date} ({req.timeSlot} hrs)
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    <span className="font-semibold text-slate-700">Objetivo del estudiante: </span>
                    {req.topicNotes}
                  </p>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 pt-1">
                    <span>Modalidad {req.modality}</span>
                    <span>·</span>
                    <span className="font-mono tabular-nums">Duración: {req.durationHours} h</span>
                    <span>·</span>
                    <span className="font-mono tabular-nums text-slate-800 font-medium">
                      Tu pago neto: L. {req.subtotalHnl}.00
                    </span>
                    <span>·</span>
                    <span className="font-mono tabular-nums">
                      Comisión TutorHn: L. {req.platformFeeHnl}.00
                    </span>
                  </div>
                </div>

                {/* Botones de acción para el tutor */}
                <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full lg:w-auto justify-end border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100">
                  {req.status === 'pendiente' && (
                    <>
                      <button
                        type="button"
                        onClick={() => onRejectRequest(req.id)}
                        className="px-3.5 py-2 border border-slate-300 hover:border-red-600 hover:text-red-700 text-slate-700 text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Rechazar</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onAcceptRequest(req.id)}
                        className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Aceptar solicitud y habilitar chat</span>
                      </button>
                    </>
                  )}

                  {req.status === 'aceptada' && (
                    <button
                      type="button"
                      onClick={() => onOpenChatForRequest(req.id)}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Abrir conversación con {req.studentName.split(' ')[0]}</span>
                    </button>
                  )}

                  {req.status === 'rechazada' && (
                    <button
                      type="button"
                      onClick={() => onAcceptRequest(req.id)}
                      className="px-3.5 py-2 border border-slate-300 hover:border-slate-900 text-slate-700 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0"
                    >
                      Reconsiderar y aceptar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/* ============================================================================
 * 3. PANEL DE VERIFICACIÓN DE TUTORES (MODERACIÓN DE DEMOSTRACIÓN)
 * ========================================================================== */
interface VerificationPanelViewProps {
  tutors: Tutor[];
  onChangeVerification: (
    tutorId: string,
    newStatus: VerificationStatus,
    newNote: string
  ) => void;
  onOpenTutorProfile: (tutorId: string) => void;
}

export const VerificationPanelView: React.FC<VerificationPanelViewProps> = ({
  tutors,
  onChangeVerification,
  onOpenTutorProfile,
}) => {
  const [filterStatus, setFilterStatus] = useState<'todos' | VerificationStatus>('todos');

  const filteredTutors = tutors.filter((t) =>
    filterStatus === 'todos' ? true : t.verificationStatus === filterStatus
  );

  const verifiedCount = tutors.filter((t) => t.verificationStatus === 'verificado').length;
  const pendingCount = tutors.filter((t) => t.verificationStatus === 'pendiente').length;
  const rejectedCount = tutors.filter((t) => t.verificationStatus === 'rechazado').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <p className="text-xs font-medium text-slate-500">
            Comité de Confianza y Credenciales Académicas · TutorHn
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
            Verificación de tutores
          </h1>
        </div>
        <p className="text-xs text-slate-600 max-w-md">
          Cambia el estado de cualquier tutor entre <strong>Pendiente</strong>,{' '}
          <strong>Verificado</strong> y <strong>Rechazado</strong>. Los cambios se reflejan de
          inmediato en el catálogo y en el perfil del tutor.
        </p>
      </div>

      {/* Contadores y barra de filtro interactiva */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg">
          <button
            type="button"
            onClick={() => setFilterStatus('todos')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
              filterStatus === 'todos'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Todos ({tutors.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('pendiente')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
              filterStatus === 'pendiente'
                ? 'bg-white text-amber-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pendientes ({pendingCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('verificado')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
              filterStatus === 'verificado'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Verificados ({verifiedCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('rechazado')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
              filterStatus === 'rechazado'
                ? 'bg-white text-red-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Rechazados ({rejectedCount})
          </button>
        </div>

        <div className="text-xs text-slate-500">
          Protocolo: Revisión de título universitario (UNAH / UNITEC / UPNFM) y documento de
          identidad.
        </div>
      </div>

      {/* Lista de tutores para verificar */}
      <div className="space-y-4">
        {filteredTutors.map((tutor) => (
          <div
            key={tutor.id}
            className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5"
          >
            <div className="flex items-start gap-4 max-w-2xl">
              <TutorPortrait
                src={tutor.portraitUrl}
                name={tutor.name}
                initials={tutor.initials}
                accentHex={tutor.accentHex}
                sizeClass="w-14 h-14"
                roundedClass="rounded-xl"
              />
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span>{tutor.city}</span>
                  <span>·</span>
                  <span>{tutor.university}</span>
                  <span>·</span>
                  <VerificationLabel status={tutor.verificationStatus} />
                </div>
                <h2 className="text-base font-bold text-slate-900">
                  <button
                    type="button"
                    onClick={() => onOpenTutorProfile(tutor.id)}
                    className="hover:text-emerald-700 transition-colors text-left"
                  >
                    {tutor.name}
                  </button>
                </h2>
                <p className="text-xs text-slate-600">
                  {tutor.category} · Credenciales: {tutor.credentials.join(' / ')}
                </p>
                <p className="text-xs text-slate-500 italic">
                  Nota de expediente: {tutor.verificationNote}
                </p>
              </div>
            </div>

            {/* Controles de cambio de estado */}
            <div className="flex flex-wrap items-center gap-2 shrink-0 w-full lg:w-auto justify-end border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100">
              <button
                type="button"
                onClick={() =>
                  onChangeVerification(
                    tutor.id,
                    'pendiente',
                    'Expediente académico en revisión por el comité de TutorHn.'
                  )
                }
                className={`px-3.5 py-2 text-xs font-semibold rounded-lg border transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                  tutor.verificationStatus === 'pendiente'
                    ? 'bg-amber-600 text-white border-amber-600'
                    : 'bg-white text-slate-700 border-slate-300 hover:border-amber-600'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Marcar Pendiente</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  onChangeVerification(
                    tutor.id,
                    'verificado',
                    'Título universitario e identidad verificados satisfactoriamente por TutorHn.'
                  )
                }
                className={`px-3.5 py-2 text-xs font-semibold rounded-lg border transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                  tutor.verificationStatus === 'verificado'
                    ? 'bg-emerald-700 text-white border-emerald-700'
                    : 'bg-white text-slate-700 border-slate-300 hover:border-emerald-700'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Aprobar Verificación</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  onChangeVerification(
                    tutor.id,
                    'rechazado',
                    'Documentación incompleta: se requiere copia legible del título o constancia universitaria.'
                  )
                }
                className={`px-3.5 py-2 text-xs font-semibold rounded-lg border transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                  tutor.verificationStatus === 'rechazado'
                    ? 'bg-red-700 text-white border-red-700'
                    : 'bg-white text-slate-700 border-slate-300 hover:border-red-700'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Rechazar</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ============================================================================
 * 4. ACCESO Y REGISTRO (ESTUDIANTE / PADRE Y TUTOR)
 * ========================================================================== */
interface AuthViewProps {
  currentUser: CurrentUser;
  onSelectUser: (user: CurrentUser) => void;
  onRegisterNewTutor: (newTutorData: {
    name: string;
    email: string;
    city: HondurasCity;
    category: SubjectCategory;
    specialty: string;
    hourlyRateHnl: number;
    modality: Modality;
    university: string;
    bio: string;
  }) => void;
}

export const AuthView: React.FC<AuthViewProps> = ({
  currentUser,
  onSelectUser,
  onRegisterNewTutor,
}) => {
  const [roleTab, setRoleTab] = useState<'estudiante-padre' | 'tutor'>('estudiante-padre');
  const [authMode, setAuthMode] = useState<'registro' | 'acceso'>('registro');
  const [subRole, setSubRole] = useState<'estudiante' | 'padre'>('estudiante');

  // Formulario Estudiante / Padre
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState<HondurasCity>('Tegucigalpa');

  // Formulario extra para Tutor
  const [category, setCategory] = useState<SubjectCategory>('Matemáticas y Cálculo');
  const [specialty, setSpecialty] = useState('Cálculo I y Álgebra Lineal');
  const [hourlyRate, setHourlyRate] = useState('350');
  const [modality, setModality] = useState<Modality>('Híbrido');
  const [university, setUniversity] = useState('Universidad Nacional Autónoma de Honduras (UNAH)');
  const [bio, setBio] = useState(
    'Docente universitario apasionado por la enseñanza personalizada con enfoque en resolución de ejercicios prácticos.'
  );

  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!email.includes('@')) {
      setFormError('Por favor ingresa un correo electrónico válido (ej. nombre@correo.hn).');
      return;
    }

    if (authMode === 'registro' && fullName.trim().length < 3) {
      setFormError('Por favor ingresa tu nombre y apellido completo.');
      return;
    }

    if (roleTab === 'tutor' && authMode === 'registro') {
      const rateNum = Number(hourlyRate);
      if (Number.isNaN(rateNum) || rateNum < 100) {
        setFormError('Ingresa una tarifa por hora válida en Lempiras (mínimo L. 100).');
        return;
      }

      onRegisterNewTutor({
        name: fullName.trim(),
        email: email.trim(),
        city,
        category,
        specialty: specialty.trim() || category,
        hourlyRateHnl: rateNum,
        modality,
        university: university.trim() || 'UNAH',
        bio: bio.trim(),
      });
      setFormSuccess(
        `¡Perfil de tutor creado para ${fullName}! Tu expediente quedó en estado Pendiente en el panel de Verificación.`
      );
      return;
    }

    const displayName =
      fullName.trim() ||
      (roleTab === 'tutor' ? 'Ing. Carlos Andrés Mendoza' : 'Valeria Paz');

    onSelectUser({
      id: `user-${Date.now()}`,
      name: displayName,
      email: email.trim(),
      role: roleTab === 'tutor' ? 'tutor' : subRole,
      city,
      linkedTutorId: roleTab === 'tutor' ? 'tutor-2' : undefined,
    });

    setFormSuccess(`Sesión activa actualizada como ${displayName}.`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Columna izquierda: Perfiles rápidos de demostración */}
        <div className="lg:col-span-5 bg-slate-900 text-white rounded-2xl p-6 sm:p-8 space-y-6">
          <div>
            <p className="text-xs font-medium text-emerald-400">
              Demostración interactiva · TutorHn
            </p>
            <h1 className="text-2xl font-bold tracking-tight mt-1">
              Acceso rápido por perfil
            </h1>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Selecciona un perfil preconfigurado con un clic o utiliza el formulario para registrar
              un nuevo estudiante, padre de familia o tutor particular en Honduras.
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold text-slate-300">
              Sesión activa actual:{' '}
              <span className="text-white underline">{currentUser.name}</span> ({currentUser.role})
            </p>

            <button
              type="button"
              onClick={() =>
                onSelectUser({
                  id: 'user-valeria',
                  name: 'Valeria Paz',
                  email: 'valeria.paz@unah.hn',
                  role: 'estudiante',
                  city: 'Tegucigalpa',
                })
              }
              className="w-full text-left p-4 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700 transition-colors flex items-center justify-between gap-3"
            >
              <div>
                <p className="text-xs font-bold text-white">
                  Valeria Paz · Estudiante Universitaria (UNAH)
                </p>
                <p className="text-xs text-slate-300 mt-0.5">
                  Tegucigalpa · Ideal para buscar tutores, solicitar clases y chatear
                </p>
              </div>
              {currentUser.name === 'Valeria Paz' && (
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              )}
            </button>

            <button
              type="button"
              onClick={() =>
                onSelectUser({
                  id: 'user-roberto',
                  name: 'Roberto Flores',
                  email: 'rflores.familia@correo.hn',
                  role: 'padre',
                  city: 'San Pedro Sula',
                })
              }
              className="w-full text-left p-4 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700 transition-colors flex items-center justify-between gap-3"
            >
              <div>
                <p className="text-xs font-bold text-white">
                  Roberto Flores · Padre de Familia
                </p>
                <p className="text-xs text-slate-300 mt-0.5">
                  San Pedro Sula · Busca reforzamiento escolar bilingüe y preparación PAA
                </p>
              </div>
              {currentUser.name === 'Roberto Flores' && (
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              )}
            </button>

            <button
              type="button"
              onClick={() =>
                onSelectUser({
                  id: 'user-carlos-tutor',
                  name: 'Ing. Carlos Andrés Mendoza',
                  email: 'carlos.mendoza@unitec.edu',
                  role: 'tutor',
                  city: 'San Pedro Sula',
                  linkedTutorId: 'tutor-2',
                })
              }
              className="w-full text-left p-4 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700 transition-colors flex items-center justify-between gap-3"
            >
              <div>
                <p className="text-xs font-bold text-white">
                  Ing. Carlos Andrés Mendoza · Tutor Verificado
                </p>
                <p className="text-xs text-slate-300 mt-0.5">
                  San Pedro Sula · Permite administrar solicitudes recibidas en el Panel de Tutor
                </p>
              </div>
              {currentUser.role === 'tutor' && (
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              )}
            </button>
          </div>
        </div>

        {/* Columna derecha: Formulario funcional de Acceso y Registro */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
            {/* Selector de Rol: Estudiante/Padre vs Tutor */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
              <button
                type="button"
                onClick={() => {
                  setRoleTab('estudiante-padre');
                  setFormError('');
                  setFormSuccess('');
                }}
                className={`px-3.5 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  roleTab === 'estudiante-padre'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Soy Estudiante o Padre
              </button>
              <button
                type="button"
                onClick={() => {
                  setRoleTab('tutor');
                  setFormError('');
                  setFormSuccess('');
                }}
                className={`px-3.5 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  roleTab === 'tutor'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Soy Tutor Particular
              </button>
            </div>

            {/* Selector Registro vs Iniciar sesión */}
            <div className="flex items-center gap-3 text-xs">
              <button
                type="button"
                onClick={() => setAuthMode('registro')}
                className={`font-semibold transition-colors ${
                  authMode === 'registro'
                    ? 'text-emerald-700 underline'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Crear cuenta
              </button>
              <span className="text-slate-300">|</span>
              <button
                type="button"
                onClick={() => setAuthMode('acceso')}
                className={`font-semibold transition-colors ${
                  authMode === 'acceso'
                    ? 'text-emerald-700 underline'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Iniciar sesión
              </button>
            </div>
          </div>

          {formError && (
            <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-800">
              {formError}
            </div>
          )}

          {formSuccess && (
            <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-medium">
              {formSuccess}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {roleTab === 'estudiante-padre' && authMode === 'registro' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Perfil de usuario
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSubRole('estudiante')}
                    className={`py-2.5 px-3 rounded-lg border text-xs font-semibold transition-colors ${
                      subRole === 'estudiante'
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-200 text-slate-700 hover:border-slate-400'
                    }`}
                  >
                    Estudiante (Universitario / Adulto)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSubRole('padre')}
                    className={`py-2.5 px-3 rounded-lg border text-xs font-semibold transition-colors ${
                      subRole === 'padre'
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-200 text-slate-700 hover:border-slate-400'
                    }`}
                  >
                    Padre o Madre de Familia
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {authMode === 'registro' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={
                      roleTab === 'tutor' ? 'Ej. Ing. Elena Pineda' : 'Ej. Andrea Rápalo'
                    }
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-slate-900"
                  />
                </div>
              )}

              <div className={authMode === 'acceso' ? 'sm:col-span-2' : ''}>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@correo.hn"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Ciudad en Honduras
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value as HondurasCity)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-slate-900"
                >
                  {HONDURAS_CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Contraseña (Simulación)
                </label>
                <input
                  type="password"
                  defaultValue="demo12345"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-slate-900"
                />
              </div>
            </div>

            {/* Campos específicos si se registra como Nuevo Tutor */}
            {roleTab === 'tutor' && authMode === 'registro' && (
              <div className="pt-3 border-t border-slate-200 space-y-4">
                <p className="text-xs font-semibold text-emerald-800">
                  Datos profesionales para el catálogo de tutores (Se creará en estado Pendiente de
                  verificación)
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Área principal de enseñanza
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as SubjectCategory)}
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900"
                    >
                      {SUBJECT_CATEGORIES.map((cat) => (
                        <option key={cat.name} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Especialidad destacada
                    </label>
                    <input
                      type="text"
                      value={specialty}
                      onChange={(e) => setSpecialty(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Precio por hora (L.)
                    </label>
                    <input
                      type="number"
                      min={100}
                      max={2000}
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm font-mono tabular-nums bg-white border border-slate-300 rounded-lg text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Modalidad
                    </label>
                    <select
                      value={modality}
                      onChange={(e) => setModality(e.target.value as Modality)}
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900"
                    >
                      <option value="Virtual">Virtual</option>
                      <option value="Presencial">Presencial</option>
                      <option value="Híbrido">Híbrido</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Universidad / Institución
                    </label>
                    <input
                      type="text"
                      value={university}
                      onChange={(e) => setUniversity(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Presentación breve para los estudiantes
                  </label>
                  <textarea
                    rows={2}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 px-5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                {authMode === 'registro'
                  ? roleTab === 'tutor'
                    ? 'Registrar perfil de tutor en TutorHn'
                    : 'Crear cuenta de estudiante / padre'
                  : 'Iniciar sesión en TutorHn'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
