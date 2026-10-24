import React from 'react';
import {
  ShieldCheck,
  Clock,
  AlertTriangle,
  Star,
  MapPin,
  ArrowUpRight,
  CalendarPlus,
} from 'lucide-react';
import { Tutor } from '../types';
import { TutorPortrait } from './TutorPortrait';

interface TutorCardProps {
  tutor: Tutor;
  onOpenProfile: (tutorId: string) => void;
  onRequestTutoring: (tutor: Tutor) => void;
}

export const VerificationLabel: React.FC<{
  status: Tutor['verificationStatus'];
}> = ({ status }) => {
  if (status === 'verificado') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 whitespace-nowrap shrink-0">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
        <span>Tutor Verificado</span>
      </span>
    );
  }
  if (status === 'pendiente') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 whitespace-nowrap shrink-0">
        <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
        <span>Verificación pendiente</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-red-700 whitespace-nowrap shrink-0">
      <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0" />
      <span>Verificación rechazada</span>
    </span>
  );
};

export const TutorCard: React.FC<TutorCardProps> = ({
  tutor,
  onOpenProfile,
  onRequestTutoring,
}) => {
  return (
    <article className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between transition-colors hover:border-slate-300">
      <div>
        {/* Top Row: Portrait + Name + Price */}
        <div className="flex items-start justify-between gap-3.5">
          <div className="flex items-start gap-3.5 min-w-0">
            <TutorPortrait
              src={tutor.portraitUrl}
              name={tutor.name}
              initials={tutor.initials}
              accentHex={tutor.accentHex}
              sizeClass="w-14 h-14"
              roundedClass="rounded-xl"
            />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-0.5">
                <span>{tutor.category}</span>
                <span aria-hidden="true">·</span>
                <VerificationLabel status={tutor.verificationStatus} />
              </div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight truncate">
                <button
                  type="button"
                  onClick={() => onOpenProfile(tutor.id)}
                  className="hover:text-emerald-700 transition-colors text-left"
                >
                  {tutor.name}
                </button>
              </h3>
              <p className="text-xs text-slate-600 line-clamp-1 mt-0.5">
                {tutor.headline}
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-base font-bold font-mono tabular-nums text-slate-900 block">
              L. {tutor.hourlyRateHnl}
            </span>
            <span className="text-xs text-slate-500">por hora</span>
          </div>
        </div>

        {/* Unboxed Metadata Line */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-slate-600">
          <span className="inline-flex items-center gap-1 font-medium text-slate-800">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span className="font-mono tabular-nums">{tutor.rating.toFixed(1)}</span>
            <span className="text-slate-500 font-normal tabular-nums">
              ({tutor.reviewCount} reseñas)
            </span>
          </span>
          <span aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>{tutor.city}</span>
          </span>
          <span aria-hidden="true">·</span>
          <span>Modalidad {tutor.modality}</span>
          <span aria-hidden="true">·</span>
          <span className="tabular-nums">{tutor.completedSessions} clases</span>
        </div>

        {/* Bio excerpt */}
        <p className="mt-3 text-xs text-slate-600 leading-relaxed line-clamp-2">
          {tutor.bio}
        </p>

        {/* Specialties as clean unboxed typographic list */}
        <div className="mt-3 text-xs text-slate-500">
          <span className="font-semibold text-slate-700">Especialidades: </span>
          {tutor.specialties.join(' · ')}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2.5">
        <button
          type="button"
          onClick={() => onOpenProfile(tutor.id)}
          className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-200 hover:border-slate-400 rounded-lg transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
        >
          <span>Ver perfil completo</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => onRequestTutoring(tutor)}
          className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
        >
          <CalendarPlus className="w-3.5 h-3.5" />
          <span>Solicitar tutoría</span>
        </button>
      </div>
    </article>
  );
};
