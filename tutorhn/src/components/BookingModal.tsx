import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  ArrowRight,
  Lock,
  AlertCircle,
} from 'lucide-react';
import { Tutor, TutoringRequest, CurrentUser } from '../types';
import { TutorPortrait } from './TutorPortrait';

interface BookingModalProps {
  tutor: Tutor;
  currentUser: CurrentUser;
  onClose: () => void;
  onConfirmBooking: (newRequest: TutoringRequest) => void;
  onGoToRequests: () => void;
  onGoToTutorPanel: (tutorId: string) => void;
}

const SUGGESTED_DATES = [
  'Martes 27 de octubre, 2026',
  'Miércoles 28 de octubre, 2026',
  'Jueves 29 de octubre, 2026',
  'Viernes 30 de octubre, 2026',
  'Sábado 31 de octubre, 2026',
];

const PAYMENT_METHODS = [
  'Tarjeta Débito / Crédito BAC Credomatic •••• 4821 (Demo)',
  'Transferencia Inmediata Kash / Banco Atlántida (Demo)',
  'Tarjeta Banco Ficohsa •••• 9014 (Demo)',
  'Billetera Tigo Money Honduras (Demo)',
];

export const BookingModal: React.FC<BookingModalProps> = ({
  tutor,
  currentUser,
  onClose,
  onConfirmBooking,
  onGoToRequests,
  onGoToTutorPanel,
}) => {
  const defaultModality: 'Virtual' | 'Presencial' =
    tutor.modality === 'Presencial' ? 'Presencial' : 'Virtual';

  const [step, setStep] = useState<'configurar' | 'pago' | 'confirmado'>('configurar');
  const [selectedSubject, setSelectedSubject] = useState<string>(
    tutor.specialties[0] || tutor.category
  );
  const [selectedDate, setSelectedDate] = useState<string>(SUGGESTED_DATES[1]);
  const [selectedTime, setSelectedTime] = useState<string>(
    tutor.availability[0]?.hours[0] || '16:00'
  );
  const [selectedModality, setSelectedModality] = useState<'Virtual' | 'Presencial'>(
    defaultModality
  );
  const [durationHours, setDurationHours] = useState<number>(1.5);
  const [topicNotes, setTopicNotes] = useState<string>(
    `Repaso práctico de ${tutor.specialties[0] || tutor.category} y resolución de guía de estudio.`
  );
  const [paymentMethod, setPaymentMethod] = useState<string>(PAYMENT_METHODS[0]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [createdRequest, setCreatedRequest] = useState<TutoringRequest | null>(null);

  const subtotalHnl = Math.round(tutor.hourlyRateHnl * durationHours);
  const platformFeeHnl = Math.round(subtotalHnl * 0.1);
  const totalPaidHnl = subtotalHnl + platformFeeHnl;

  const availableTimeSlots = Array.from(
    new Set(tutor.availability.flatMap((slot) => slot.hours))
  );

  const handleContinueToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicNotes.trim() || topicNotes.trim().length < 8) {
      setErrorMessage(
        'Por favor describe brevemente el tema o ejercicio que necesitas trabajar en la sesión.'
      );
      return;
    }
    setErrorMessage('');
    setStep('pago');
  };

  const handleConfirmSimulatedPayment = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const requestNumber = Math.floor(1000 + Math.random() * 9000);
      const newReq: TutoringRequest = {
        id: `req-${requestNumber}`,
        tutorId: tutor.id,
        tutorName: tutor.name,
        tutorHeadline: tutor.headline,
        tutorCity: tutor.city,
        tutorPortraitUrl: tutor.portraitUrl,
        studentName: currentUser.name,
        studentRole:
          currentUser.role === 'padre'
            ? 'Padre / Madre de familia'
            : 'Estudiante registrado',
        subject: selectedSubject,
        date: selectedDate,
        timeSlot: selectedTime,
        modality: selectedModality,
        durationHours,
        topicNotes: topicNotes.trim(),
        hourlyRateHnl: tutor.hourlyRateHnl,
        subtotalHnl,
        platformFeeHnl,
        totalPaidHnl,
        paymentMethodLabel: paymentMethod,
        paymentReference: `THN-2026-${requestNumber}`,
        status: 'pendiente',
        createdAt: 'Justo ahora',
      };

      setCreatedRequest(newReq);
      setIsSubmitting(false);
      onConfirmBooking(newReq);
      setStep('confirmado');
    }, 350);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
    >
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full overflow-hidden shadow-xl my-8">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-900 text-white">
          <div>
            <p className="text-xs text-slate-300">
              {step === 'configurar' && 'Paso 1 de 2 · Configuración de tutoría'}
              {step === 'pago' && 'Paso 2 de 2 · Resumen y pago simulado en garantía'}
              {step === 'confirmado' && 'Solicitud registrada exitosamente'}
            </p>
            <h2 id="booking-modal-title" className="text-lg font-semibold tracking-tight">
              {step === 'confirmado'
                ? 'Solicitud enviada al tutor'
                : `Solicitar tutoría con ${tutor.name}`}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tutor summary bar */}
        <div className="px-6 py-3.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <TutorPortrait
              src={tutor.portraitUrl}
              name={tutor.name}
              initials={tutor.initials}
              accentHex={tutor.accentHex}
              sizeClass="w-11 h-11"
              roundedClass="rounded-lg"
            />
            <div>
              <p className="text-sm font-semibold text-slate-900">{tutor.name}</p>
              <p className="text-xs text-slate-600">
                {tutor.city} · Modalidad {tutor.modality} ·{' '}
                <span className="font-mono tabular-nums font-medium text-slate-900">
                  L. {tutor.hourlyRateHnl} / hora
                </span>
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-500 block">Total estimado (con comisión)</span>
            <span className="text-base font-bold font-mono tabular-nums text-emerald-700">
              L. {totalPaidHnl}.00
            </span>
          </div>
        </div>

        {/* Step 1: Session Configuration */}
        {step === 'configurar' && (
          <form onSubmit={handleContinueToPayment} className="p-6 space-y-5">
            {errorMessage && (
              <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-800">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Materia o especialidad a reforzar
                </label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-slate-900"
                >
                  {tutor.specialties.map((spec) => (
                    <option key={spec} value={spec}>
                      {spec}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Modalidad de la sesión
                </label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-lg">
                  <button
                    type="button"
                    disabled={tutor.modality === 'Presencial'}
                    onClick={() => setSelectedModality('Virtual')}
                    className={`py-2 px-3 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                      selectedModality === 'Virtual'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 disabled:opacity-40'
                    }`}
                  >
                    Virtual (Videollamada)
                  </button>
                  <button
                    type="button"
                    disabled={tutor.modality === 'Virtual'}
                    onClick={() => setSelectedModality('Presencial')}
                    className={`py-2 px-3 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                      selectedModality === 'Presencial'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 disabled:opacity-40'
                    }`}
                  >
                    Presencial ({tutor.city})
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  <Calendar className="w-3.5 h-3.5 inline mr-1 text-slate-500" />
                  Fecha disponible de ejemplo
                </label>
                <select
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-slate-900"
                >
                  {SUGGESTED_DATES.map((dateStr) => (
                    <option key={dateStr} value={dateStr}>
                      {dateStr}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  <Clock className="w-3.5 h-3.5 inline mr-1 text-slate-500" />
                  Hora de inicio
                </label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm font-mono tabular-nums bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-slate-900"
                >
                  {availableTimeSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot} hrs
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Duración de la tutoría
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[1, 1.5, 2].map((hrs) => (
                  <button
                    key={hrs}
                    type="button"
                    onClick={() => setDurationHours(hrs)}
                    className={`py-2.5 px-3 rounded-lg border text-xs font-medium transition-colors flex items-center justify-between ${
                      durationHours === hrs
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400'
                    }`}
                  >
                    <span>{hrs === 1 ? '1 hora' : `${hrs} horas`}</span>
                    <span className="font-mono tabular-nums">
                      L. {Math.round(tutor.hourlyRateHnl * hrs)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Objetivo o temas específicos para el tutor
              </label>
              <textarea
                rows={3}
                value={topicNotes}
                onChange={(e) => setTopicNotes(e.target.value)}
                placeholder="Ej. Preparación para segundo examen parcial, dudas en ejercicios de la guía..."
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-slate-900"
              />
            </div>

            <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap shrink-0"
              >
                <span>Continuar al pago simulado</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* Step 2: Simulated Payment Screen */}
        {step === 'pago' && (
          <div className="p-6 space-y-5">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Sesión programada</span>
                <span className="font-medium text-slate-900">
                  {selectedDate} · {selectedTime} hrs ({selectedModality})
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Honorarios del tutor ({durationHours} h × L. {tutor.hourlyRateHnl})</span>
                <span className="font-mono tabular-nums font-medium text-slate-900">
                  L. {subtotalHnl}.00
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>
                  Comisión de plataforma TutorHn (10% · Garantía y soporte)
                </span>
                <span className="font-mono tabular-nums font-medium text-slate-900">
                  L. {platformFeeHnl}.00
                </span>
              </div>
              <div className="pt-2.5 border-t border-slate-200 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-900">
                  Total de la contratación (Demostración)
                </span>
                <span className="text-lg font-bold font-mono tabular-nums text-emerald-700">
                  L. {totalPaidHnl}.00
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                <CreditCard className="w-3.5 h-3.5 inline mr-1.5 text-slate-600" />
                Método de pago simulado (Honduras)
              </label>
              <div className="space-y-2">
                {PAYMENT_METHODS.map((method) => (
                  <label
                    key={method}
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors text-xs ${
                      paymentMethod === method
                        ? 'border-slate-900 bg-slate-50 font-semibold text-slate-900'
                        : 'border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === method}
                        onChange={() => setPaymentMethod(method)}
                        className="accent-slate-900"
                      />
                      <span>{method}</span>
                    </div>
                    <span className="text-slate-500 font-mono">Sin cargo real</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-emerald-50/70 border border-emerald-200 flex items-start gap-2.5 text-xs text-emerald-950">
              <Lock className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Pago simulado en custodia (Demo)</p>
                <p className="text-emerald-800 mt-0.5">
                  Esta pantalla simula la retención del pago y la comisión del 10% de TutorHn. Al
                  aceptar el tutor tu solicitud, se habilitará el chat directo para coordinar la
                  clase.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setStep('configurar')}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
              >
                Volver a detalles
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleConfirmSimulatedPayment}
                className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap shrink-0"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>
                  {isSubmitting
                    ? 'Procesando demostración...'
                    : `Confirmar demostración (L. ${totalPaidHnl}.00)`}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Confirmed State */}
        {step === 'confirmado' && createdRequest && (
          <div className="p-6 space-y-5">
            <div className="flex items-start gap-3.5 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
              <CheckCircle2 className="w-6 h-6 text-emerald-700 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-slate-900">
                  ¡Solicitud #{createdRequest.id} registrada con estado Pendiente!
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Se registró el pago simulado por{' '}
                  <span className="font-mono font-semibold tabular-nums">
                    L. {createdRequest.totalPaidHnl}.00
                  </span>{' '}
                  (incluyendo <span className="font-mono">L. {createdRequest.platformFeeHnl}.00</span>{' '}
                  de comisión de plataforma) con referencia{' '}
                  <span className="font-mono font-semibold">{createdRequest.paymentReference}</span>.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <p className="font-semibold text-slate-900">
                Siguiente paso en el recorrido de demostración:
              </p>
              <p className="text-slate-600">
                Ahora puedes abrir el <strong>Panel de Tutor</strong> de {tutor.name} para aceptar
                esta solicitud y desbloquear automáticamente la conversación en{' '}
                <strong>Mensajes</strong>.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={onGoToRequests}
                className="px-4 py-2.5 border border-slate-300 hover:border-slate-900 text-slate-800 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                Ver mis solicitudes
              </button>
              <button
                type="button"
                onClick={() => onGoToTutorPanel(tutor.id)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap shrink-0"
              >
                <span>Ir al Panel de Tutor para aceptar solicitud</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
