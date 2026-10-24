import {
  Tutor,
  ReviewItem,
  TutoringRequest,
  Conversation,
  CurrentUser,
  SubjectCategory,
  HondurasCity,
} from '../types';

interface PortraitConfig {
  bgStart: string;
  bgEnd: string;
  skin: string;
  hair: string;
  shirt: string;
  blazer?: string;
  glasses?: boolean;
  hairStyle: 'short' | 'long' | 'bun' | 'curly';
}

function createPortraitDataUri(config: PortraitConfig): string {
  const hairBack =
    config.hairStyle === 'long'
      ? `<path d="M72 95 C56 140 58 215 70 250 L186 250 C198 215 200 140 184 95 Z" fill="${config.hair}"/>`
      : config.hairStyle === 'curly'
      ? `<circle cx="82" cy="112" r="28" fill="${config.hair}"/><circle cx="174" cy="112" r="28" fill="${config.hair}"/><circle cx="76" cy="148" r="24" fill="${config.hair}"/><circle cx="180" cy="148" r="24" fill="${config.hair}"/>`
      : config.hairStyle === 'bun'
      ? `<circle cx="128" cy="52" r="24" fill="${config.hair}"/>`
      : '';

  const hairTop =
    config.hairStyle === 'short'
      ? `<path d="M82 104 C82 64 174 64 174 104 C174 86 152 78 128 78 C104 78 82 86 82 104 Z" fill="${config.hair}"/>`
      : `<path d="M78 110 C78 62 178 62 178 110 C166 84 146 78 128 78 C108 78 90 86 78 110 Z" fill="${config.hair}"/>`;

  const glassesSvg = config.glasses
    ? `<g stroke="#1e293b" stroke-width="3" fill="none">
         <rect x="94" y="112" width="26" height="18" rx="5" fill="#ffffff" fill-opacity="0.18"/>
         <rect x="136" y="112" width="26" height="18" rx="5" fill="#ffffff" fill-opacity="0.18"/>
         <line x1="120" y1="120" x2="136" y2="120"/>
       </g>`
    : '';

  const blazerSvg = config.blazer
    ? `<path d="M44 256 C52 204 82 190 104 188 L128 236 L152 188 C174 190 204 204 212 256 Z" fill="${config.blazer}"/>`
    : '';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${config.bgStart}"/>
        <stop offset="100%" stop-color="${config.bgEnd}"/>
      </linearGradient>
    </defs>
    <rect width="256" height="256" fill="url(#bg)"/>
    <circle cx="210" cy="44" r="64" fill="#ffffff" fill-opacity="0.07"/>
    ${hairBack}
    <path d="M44 256 C52 200 88 186 128 186 C168 186 204 200 212 256 Z" fill="${config.shirt}"/>
    ${blazerSvg}
    <rect x="112" y="160" width="32" height="36" rx="12" fill="${config.skin}"/>
    <ellipse cx="128" cy="124" rx="46" ry="54" fill="${config.skin}"/>
    ${hairTop}
    <circle cx="108" cy="121" r="4.2" fill="#0f172a"/>
    <circle cx="148" cy="121" r="4.2" fill="#0f172a"/>
    <path d="M98 108 Q108 103 117 107" stroke="${config.hair}" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M139 107 Q148 103 158 108" stroke="${config.hair}" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M128 122 L125 135 L131 135" stroke="#b47b56" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M113 148 Q128 159 143 148" stroke="#8c4a32" stroke-width="3.2" fill="none" stroke-linecap="round"/>
    ${glassesSvg}
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const SUBJECT_CATEGORIES: {
  name: SubjectCategory;
  shortLabel: string;
  tutorCount: number;
  demandSummary: string;
}[] = [
  {
    name: 'Matemáticas y Cálculo',
    shortLabel: 'Matemáticas',
    tutorCount: 28,
    demandSummary: 'Álgebra, Cálculo I-III, Geometría y PAA UNAH',
  },
  {
    name: 'Inglés y Certificaciones',
    shortLabel: 'Inglés y TOEFL',
    tutorCount: 22,
    demandSummary: 'Inglés conversacional, TOEFL iBT e Inglés de negocios',
  },
  {
    name: 'Programación y Datos',
    shortLabel: 'Programación',
    tutorCount: 16,
    demandSummary: 'Python, JavaScript, SQL, Estructuras de Datos y Excel',
  },
  {
    name: 'Física y Química',
    shortLabel: 'Física y Química',
    tutorCount: 19,
    demandSummary: 'Física General, Química Orgánica y Biología Celular',
  },
  {
    name: 'Contabilidad y Finanzas',
    shortLabel: 'Finanzas',
    tutorCount: 14,
    demandSummary: 'Contabilidad Financiera, Costos, NIIF y Estadística',
  },
  {
    name: 'Reforzamiento Escolar',
    shortLabel: 'Escolar y PAA',
    tutorCount: 25,
    demandSummary: 'Primaria bilingüe, secundaria, lectoescritura y estudio dirigido',
  },
];

export const HONDURAS_CITIES: HondurasCity[] = [
  'Tegucigalpa',
  'San Pedro Sula',
  'La Ceiba',
  'Comayagua',
  'Choluteca',
];

export const INITIAL_TUTORS: Tutor[] = [
  {
    id: 'tutor-1',
    name: 'Ing. Alejandra Valladares',
    headline: 'Catedrática de Cálculo, Álgebra Lineal y Preparación PAA',
    category: 'Matemáticas y Cálculo',
    specialties: ['Cálculo Diferencial e Integral', 'Álgebra Lineal', 'Preparación PAA UNAH', 'Ecuaciones Diferenciales'],
    city: 'Tegucigalpa',
    zoneDetail: 'Col. Lomas del Guijarro y Ciudad Universitaria',
    modality: 'Híbrido',
    hourlyRateHnl: 380,
    rating: 4.9,
    reviewCount: 42,
    completedSessions: 318,
    responseTime: 'Responde en 15 min',
    verificationStatus: 'verificado',
    verificationNote: 'Título de Ingeniería Civil (UNAH) y colegiación CICH verificados.',
    university: 'Universidad Nacional Autónoma de Honduras (UNAH)',
    yearsExperience: 7,
    bio: 'Ingeniera civil con maestría en docencia superior y 7 años preparando estudiantes universitarios de UNAH, UNITEC y Zamorano. Me especializo en transformar conceptos abstractos de cálculo y álgebra en pasos lógicos y prácticos.',
    methodology: 'Resolución guiada de exámenes parciales reales, pizarra digital interactiva y guía de ejercicios personalizados después de cada sesión.',
    credentials: [
      'Ingeniera Civil — UNAH (Cum Laude)',
      'Maestría en Docencia Superior — UPNFM',
      'Identidad y antecedentes verificados por TutorHn',
    ],
    availability: [
      { day: 'Lunes', hours: ['15:00', '16:30', '18:00'] },
      { day: 'Miércoles', hours: ['14:00', '16:00', '18:30'] },
      { day: 'Viernes', hours: ['15:00', '17:00'] },
      { day: 'Sábado', hours: ['09:00', '10:30', '14:00'] },
    ],
    portraitUrl: createPortraitDataUri({
      bgStart: '#0f172a',
      bgEnd: '#1e3a8a',
      skin: '#d99b72',
      hair: '#1c1917',
      shirt: '#f8fafc',
      blazer: '#0f766e',
      hairStyle: 'long',
    }),
    initials: 'AV',
    accentHex: '#0f766e',
  },
  {
    id: 'tutor-2',
    name: 'Ing. Carlos Andrés Mendoza',
    headline: 'Ingeniero de Software Senior — Python, Estructura de Datos y Cálculo',
    category: 'Programación y Datos',
    specialties: ['Python desde cero', 'JavaScript y React', 'Bases de Datos SQL', 'Lógica de Programación'],
    city: 'San Pedro Sula',
    zoneDetail: 'Barrio Río de Piedras / Circunvalación',
    modality: 'Virtual',
    hourlyRateHnl: 450,
    rating: 5.0,
    reviewCount: 36,
    completedSessions: 245,
    responseTime: 'Responde en 10 min',
    verificationStatus: 'verificado',
    verificationNote: 'Título de Ingeniería en Sistemas (UNITEC SPS) y experiencia docente validada.',
    university: 'UNITEC San Pedro Sula',
    yearsExperience: 6,
    bio: 'Desarrollador full-stack e instructor universitario en San Pedro Sula. Ayudo tanto a estudiantes de Ingeniería en Sistemas como a profesionales adultos que desean aprender programación, automatización de datos con Python o aprobar Algoritmos.',
    methodology: 'Práctica en vivo compartiendo código, depuración paso a paso y proyectos cortos adaptados al sílabo de tu universidad o trabajo.',
    credentials: [
      'Ingeniero en Sistemas Computacionales — UNITEC SPS',
      'Certificación AWS Cloud Practitioner',
      'Ex-monitor académico de Programación I y II',
    ],
    availability: [
      { day: 'Martes', hours: ['17:00', '18:30', '20:00'] },
      { day: 'Jueves', hours: ['17:00', '18:30', '20:00'] },
      { day: 'Sábado', hours: ['09:00', '11:00', '15:00'] },
    ],
    portraitUrl: createPortraitDataUri({
      bgStart: '#1e293b',
      bgEnd: '#0f172a',
      skin: '#c6865c',
      hair: '#0f172a',
      shirt: '#e2e8f0',
      blazer: '#1e3a8a',
      glasses: true,
      hairStyle: 'short',
    }),
    initials: 'CM',
    accentHex: '#1e3a8a',
  },
  {
    id: 'tutor-3',
    name: 'Lic. Sofía Zelaya Pineda',
    headline: 'Especialista Bilingüe en Inglés Conversacional, TOEFL iBT y Redacción',
    category: 'Inglés y Certificaciones',
    specialties: ['Preparación TOEFL iBT', 'Inglés Conversacional Fluido', 'Inglés para Entrevistas Laborales', 'Gramática Bilingüe'],
    city: 'Tegucigalpa',
    zoneDetail: 'Col. Palmira y Blvd. Morazán',
    modality: 'Híbrido',
    hourlyRateHnl: 350,
    rating: 4.9,
    reviewCount: 51,
    completedSessions: 410,
    responseTime: 'Responde en 20 min',
    verificationStatus: 'verificado',
    verificationNote: 'Certificación TOEFL C2 (114/120) y Licenciatura en Lenguas Extranjeras verificadas.',
    university: 'UNAH / Certificación TESOL Internacional',
    yearsExperience: 8,
    bio: 'Docente certificada TESOL con 8 años entrenando estudiantes para becas internacionales (Fulbright, Chevening) y ejecutivos que buscan fluidez en reuniones en inglés.',
    methodology: 'Simulacros cronometrados de Speaking y Writing, corrección fonética inmediata y vocabulario aplicado a escenarios reales.',
    credentials: [
      'Licenciada en Lenguas Extranjeras — UNAH',
      'Certificación TESOL 150 Horas',
      'Puntaje TOEFL iBT verificado: 114/120',
    ],
    availability: [
      { day: 'Lunes', hours: ['09:00', '11:00', '16:00', '18:00'] },
      { day: 'Martes', hours: ['10:00', '15:00', '17:00'] },
      { day: 'Jueves', hours: ['10:00', '16:00', '18:00'] },
      { day: 'Viernes', hours: ['09:00', '11:00', '15:00'] },
    ],
    portraitUrl: createPortraitDataUri({
      bgStart: '#064e3b',
      bgEnd: '#0f172a',
      skin: '#e0a47e',
      hair: '#292524',
      shirt: '#ffffff',
      blazer: '#334155',
      hairStyle: 'bun',
    }),
    initials: 'SZ',
    accentHex: '#047857',
  },
  {
    id: 'tutor-4',
    name: 'Dr. Marco Tulio Rivera',
    headline: 'Profesor de Química Orgánica, Bioquímica y Física Universitaria',
    category: 'Física y Química',
    specialties: ['Química General y Orgánica', 'Física Mecánica (FS-100)', 'Biología para Medicina', 'Estequiometría'],
    city: 'San Pedro Sula',
    zoneDetail: 'Col. Jardines del Valle y UNAH-VS',
    modality: 'Presencial',
    hourlyRateHnl: 400,
    rating: 4.8,
    reviewCount: 29,
    completedSessions: 192,
    responseTime: 'Responde en 25 min',
    verificationStatus: 'verificado',
    verificationNote: 'Doctorado en Química y Farmacia y constancia docente en UNAH-VS verificados.',
    university: 'UNAH Valle de Sula (UNAH-VS)',
    yearsExperience: 9,
    bio: 'Químico farmacéutico y apasionado por la enseñanza de las ciencias exactas en San Pedro Sula. Especialista en nivelar estudiantes de primer ingreso de Medicina, Odontología e Ingenierías.',
    methodology: 'Explicación desde fundamentos químicos y físicos, formularios estructurados y resolución de guías de laboratorio.',
    credentials: [
      'Doctor en Química y Farmacia — UNAH',
      'Diplomado en Educación Científica Universitaria',
      '9 años de experiencia en tutorías de ciencias médicas',
    ],
    availability: [
      { day: 'Lunes', hours: ['14:00', '16:00'] },
      { day: 'Miércoles', hours: ['14:00', '16:00', '18:00'] },
      { day: 'Sábado', hours: ['08:00', '10:00', '13:00'] },
    ],
    portraitUrl: createPortraitDataUri({
      bgStart: '#1e3a8a',
      bgEnd: '#0f172a',
      skin: '#c4835a',
      hair: '#1e293b',
      shirt: '#f1f5f9',
      blazer: '#0f172a',
      glasses: true,
      hairStyle: 'short',
    }),
    initials: 'MR',
    accentHex: '#1d4ed8',
  },
  {
    id: 'tutor-5',
    name: 'MSc. Valeria Castellanos',
    headline: 'Consultora en Contabilidad Financiera, Costos, NIIF y Estadística',
    category: 'Contabilidad y Finanzas',
    specialties: ['Contabilidad I y II', 'Matemática Financiera', 'Estadística Aplicada', 'Análisis de Estados Financieros'],
    city: 'Tegucigalpa',
    zoneDetail: 'Centro Comercial El Dorado / Miraflores',
    modality: 'Virtual',
    hourlyRateHnl: 360,
    rating: 4.9,
    reviewCount: 24,
    completedSessions: 164,
    responseTime: 'Responde en 15 min',
    verificationStatus: 'verificado',
    verificationNote: 'Maestría en Finanzas (UNITEC) y colegiación activa verificadas.',
    university: 'UNITEC Tegucigalpa',
    yearsExperience: 5,
    bio: 'Licenciada en Finanzas con Maestría en Administración de Proyectos. Apoyo a estudiantes de ciencias económicas y emprendedores a dominar estados financieros, costos gerenciales y estadística en Excel.',
    methodology: 'Plantillas contables prácticas en vivo, casos reales de empresas hondureñas y preparación intensiva para exámenes.',
    credentials: [
      'Maestría en Finanzas Corporativas — UNITEC',
      'Licenciada en Contaduría Pública y Finanzas',
      'Especialista en modelado financiero con Excel',
    ],
    availability: [
      { day: 'Martes', hours: ['18:00', '19:30'] },
      { day: 'Jueves', hours: ['18:00', '19:30'] },
      { day: 'Domingo', hours: ['09:30', '11:00'] },
    ],
    portraitUrl: createPortraitDataUri({
      bgStart: '#0f172a',
      bgEnd: '#065f46',
      skin: '#dba079',
      hair: '#1c1917',
      shirt: '#f8fafc',
      blazer: '#1e293b',
      hairStyle: 'long',
    }),
    initials: 'VC',
    accentHex: '#059669',
  },
  {
    id: 'tutor-6',
    name: 'Lic. Gabriela Osorto',
    headline: 'Pedagoga Bilingüe — Reforzamiento Escolar Primaria y Secundaria',
    category: 'Reforzamiento Escolar',
    specialties: ['Matemáticas de Primaria y Secundaria', 'Lectoescritura y Comprensión', 'Hábitos de Estudio (TDAH)', 'Science y Math Bilingüe'],
    city: 'La Ceiba',
    zoneDetail: 'Barrio El Imán y Zona Mazapán',
    modality: 'Híbrido',
    hourlyRateHnl: 280,
    rating: 4.9,
    reviewCount: 33,
    completedSessions: 270,
    responseTime: 'Responde en 15 min',
    verificationStatus: 'verificado',
    verificationNote: 'Título de Licenciada en Educación Básica Bilingüe (UPNFM) verificado.',
    university: 'Universidad Pedagógica Nacional Francisco Morazán (UPNFM)',
    yearsExperience: 6,
    bio: 'Educadora bilingüe dedicada al acompañamiento escolar de niños y adolescentes de escuelas bilingües y nacionales. Trabajo de cerca con padres de familia para recuperar el promedio académico y la confianza en clase.',
    methodology: 'Sesiones dinámicas de 60 o 90 minutos, seguimiento de agenda escolar semanal y reporte breve de avances para los padres.',
    credentials: [
      'Licenciada en Educación Básica Bilingüe — UPNFM',
      'Certificación en Neuroeducación y Atención Escolar',
      'Antecedentes y referencias escolares verificadas',
    ],
    availability: [
      { day: 'Lunes', hours: ['14:30', '16:00', '17:30'] },
      { day: 'Martes', hours: ['14:30', '16:00', '17:30'] },
      { day: 'Miércoles', hours: ['14:30', '16:00'] },
      { day: 'Jueves', hours: ['14:30', '16:00', '17:30'] },
    ],
    portraitUrl: createPortraitDataUri({
      bgStart: '#1e293b',
      bgEnd: '#0f766e',
      skin: '#dc9e76',
      hair: '#27272a',
      shirt: '#f0fdf4',
      blazer: '#0f172a',
      hairStyle: 'curly',
    }),
    initials: 'GO',
    accentHex: '#0d9488',
  },
  {
    id: 'tutor-7',
    name: 'Ing. Héctor David Banegas',
    headline: 'Especialista en Física Aplicada, Termodinámica y Estática',
    category: 'Física y Química',
    specialties: ['Física I y II (FS-100 / FS-200)', 'Estática y Resistencia de Materiales', 'Termodinámica', 'Cálculo Vectorial'],
    city: 'Comayagua',
    zoneDetail: 'Barrio Torondón / Centro Histórico',
    modality: 'Híbrido',
    hourlyRateHnl: 320,
    rating: 4.7,
    reviewCount: 15,
    completedSessions: 88,
    responseTime: 'Responde en 30 min',
    verificationStatus: 'pendiente',
    verificationNote: 'Expediente recibido: título de Ingeniería Electromecánica en revisión por el comité académico.',
    university: 'UNAH — Centro Regional CURC / Ciudad Universitaria',
    yearsExperience: 4,
    bio: 'Ingeniero electromecánico con amplia experiencia resolviendo problemas de física clásica, estática y circuitos eléctricos para estudiantes de ingeniería en todo el país.',
    methodology: 'Diagramas de cuerpo libre paso a paso, análisis dimensional riguroso y simuladores interactivos de física.',
    credentials: [
      'Ingeniero Electromecánico — UNAH (En validación documental)',
      'Instructor de laboratorio de Física General (2022–2025)',
    ],
    availability: [
      { day: 'Martes', hours: ['15:00', '17:00', '19:00'] },
      { day: 'Jueves', hours: ['15:00', '17:00', '19:00'] },
      { day: 'Sábado', hours: ['10:00', '14:00'] },
    ],
    portraitUrl: createPortraitDataUri({
      bgStart: '#334155',
      bgEnd: '#0f172a',
      skin: '#bf7f56',
      hair: '#18181b',
      shirt: '#f8fafc',
      blazer: '#334155',
      hairStyle: 'short',
    }),
    initials: 'HB',
    accentHex: '#475569',
  },
  {
    id: 'tutor-8',
    name: 'Lic. Jorge Luis Euceda',
    headline: 'Tutor de Estadística, Excel Avanzado y Matemática General',
    category: 'Matemáticas y Cálculo',
    specialties: ['Matemática 110 (MM-110)', 'Trigonometría (MM-111)', 'Estadística Descriptiva', 'Excel para Negocios'],
    city: 'Choluteca',
    zoneDetail: 'Barrio El Centro / Boulevard Chorotega',
    modality: 'Virtual',
    hourlyRateHnl: 300,
    rating: 4.6,
    reviewCount: 11,
    completedSessions: 54,
    responseTime: 'Responde en 40 min',
    verificationStatus: 'pendiente',
    verificationNote: 'Pendiente de validación de constancia de egresado universitario.',
    university: 'UNAH-CURLP Choluteca',
    yearsExperience: 3,
    bio: 'Licenciado en Comercio Internacional con fuerte base cuantitativa. Ayudo a estudiantes de primer ingreso universitario con MM-110, MM-111 y estadística aplicada sin complicaciones.',
    methodology: 'Clases prácticas enfocadas en los temas exactos que evalúa tu catedrático en el período actual.',
    credentials: [
      'Licenciado en Comercio Internacional — UNAH-CURLP',
      'Diplomado en Análisis de Datos con Excel y Power BI',
    ],
    availability: [
      { day: 'Lunes', hours: ['18:00', '19:30'] },
      { day: 'Miércoles', hours: ['18:00', '19:30'] },
      { day: 'Sábado', hours: ['09:00', '11:00'] },
    ],
    portraitUrl: createPortraitDataUri({
      bgStart: '#1e293b',
      bgEnd: '#312e81',
      skin: '#c8875e',
      hair: '#1e1b4b',
      shirt: '#e2e8f0',
      blazer: '#1e293b',
      glasses: true,
      hairStyle: 'short',
    }),
    initials: 'JE',
    accentHex: '#3730a3',
  },
];

export const INITIAL_REVIEWS: ReviewItem[] = [
  {
    id: 'rev-1',
    tutorId: 'tutor-1',
    authorName: 'Daniela Paz',
    authorRole: 'Estudiante de Ingeniería Industrial, UNAH (Tegucigalpa)',
    rating: 5,
    date: '14 oct 2026',
    subject: 'Cálculo I (MM-201)',
    comment: 'Llevaba mi primer parcial en 54% y no entendía optimización ni derivación implícita. Con 4 sesiones con la Ing. Alejandra logré estructurar cada procedimiento y subí mi nota final.',
    outcome: 'Pasó de 54% a 88% en el segundo examen parcial de MM-201',
  },
  {
    id: 'rev-2',
    tutorId: 'tutor-1',
    authorName: 'Roberto Flores',
    authorRole: 'Padre de familia, Instituto San Francisco (Tegucigalpa)',
    rating: 5,
    date: '02 oct 2026',
    subject: 'Preparación PAA y Precálculo',
    comment: 'Contratamos a la Ing. Alejandra para preparar a mi hijo antes de la Prueba de Aptitud Académica. La puntualidad y el material de práctica marcaron toda la diferencia.',
    outcome: '1,340 puntos en la PAA y admisión directa a Ingeniería',
  },
  {
    id: 'rev-3',
    tutorId: 'tutor-2',
    authorName: 'Kevin Enamorado',
    authorRole: 'Estudiante de Ingeniería en Sistemas, UNITEC SPS',
    rating: 5,
    date: '18 oct 2026',
    subject: 'Estructura de Datos y Python',
    comment: 'El Ing. Carlos explica árboles binarios, recursividad y complejidad algorítmica con código real en pantalla. En dos horas destrabamos el proyecto trimestral.',
    outcome: 'Proyecto entregado al 100% y defensa técnica sobresaliente',
  },
  {
    id: 'rev-4',
    tutorId: 'tutor-3',
    authorName: 'Lic. Andrea Rápalo',
    authorRole: 'Analista Financiera Regional (Tegucigalpa)',
    rating: 5,
    date: '09 oct 2026',
    subject: 'Preparación TOEFL iBT',
    comment: 'Necesitaba superar 95 puntos en el TOEFL para aplicar a una maestría en el extranjero. Las rúbricas de Speaking y Writing de Sofía son sumamente precisas.',
    outcome: 'Obtuvo 104/120 en su primer intento oficial de TOEFL iBT',
  },
  {
    id: 'rev-5',
    tutorId: 'tutor-4',
    authorName: 'Camila Handal',
    authorRole: 'Estudiante de Medicina, UNAH-VS (San Pedro Sula)',
    rating: 5,
    date: '05 oct 2026',
    subject: 'Química Orgánica',
    comment: 'El Dr. Marco Tulio tiene una paciencia admirable para explicar nomenclatura y mecanismos de reacción. Sus resúmenes me salvaron el semestre.',
    outcome: 'Aprobó Química Orgánica con 91% en el período',
  },
  {
    id: 'rev-6',
    tutorId: 'tutor-5',
    authorName: 'Fernando Aguilar',
    authorRole: 'Estudiante de Administración Industrial, USAP',
    rating: 5,
    date: '11 oct 2026',
    subject: 'Contabilidad de Costos',
    comment: 'Valeria enseña con plantillas reales de Excel y explica paso a paso el estado de costos de producción. Muy clara y puntual.',
    outcome: 'Dominio completo de costeo por órdenes y procesos',
  },
  {
    id: 'rev-7',
    tutorId: 'tutor-6',
    authorName: 'Patricia Sikaffy',
    authorRole: 'Madre de familia, Mazapán School (La Ceiba)',
    rating: 5,
    date: '16 oct 2026',
    subject: 'Math & Science 6to Grado',
    comment: 'Mi hijo recuperó la motivación y el orden en sus tareas bilingües. Gabriela nos envía un resumen al final de cada semana con los temas cubiertos.',
    outcome: 'Promedio general subió de 76% a 92% en el bimestre',
  },
];

export const INITIAL_REQUESTS: TutoringRequest[] = [
  {
    id: 'req-101',
    tutorId: 'tutor-1',
    tutorName: 'Ing. Alejandra Valladares',
    tutorHeadline: 'Catedrática de Cálculo, Álgebra Lineal y Preparación PAA',
    tutorCity: 'Tegucigalpa',
    tutorPortraitUrl: INITIAL_TUTORS[0].portraitUrl,
    studentName: 'Valeria Paz',
    studentRole: 'Estudiante universitaria (UNAH)',
    subject: 'Cálculo Diferencial e Integral (MM-201)',
    date: 'Miércoles 28 de octubre, 2026',
    timeSlot: '16:00',
    modality: 'Virtual',
    durationHours: 1.5,
    topicNotes: 'Repaso intensivo de integrales por partes y fracciones parciales antes del segundo examen parcial.',
    hourlyRateHnl: 380,
    subtotalHnl: 570,
    platformFeeHnl: 57,
    totalPaidHnl: 627,
    paymentMethodLabel: 'Tarjeta Débito BAC Credomatic •••• 4821 (Demo)',
    paymentReference: 'THN-2026-8491',
    status: 'aceptada',
    createdAt: 'Hace 2 horas',
  },
  {
    id: 'req-102',
    tutorId: 'tutor-2',
    tutorName: 'Ing. Carlos Andrés Mendoza',
    tutorHeadline: 'Ingeniero de Software Senior — Python, Estructura de Datos y Cálculo',
    tutorCity: 'San Pedro Sula',
    tutorPortraitUrl: INITIAL_TUTORS[1].portraitUrl,
    studentName: 'Valeria Paz',
    studentRole: 'Estudiante universitaria (UNAH)',
    subject: 'Python desde cero y Automatización de Datos',
    date: 'Jueves 29 de octubre, 2026',
    timeSlot: '18:30',
    modality: 'Virtual',
    durationHours: 1,
    topicNotes: 'Necesito apoyo configurando pandas en Python y limpiando un archivo CSV para mi clase de análisis numérico.',
    hourlyRateHnl: 450,
    subtotalHnl: 450,
    platformFeeHnl: 45,
    totalPaidHnl: 495,
    paymentMethodLabel: 'Transferencia Kash / Atlántida (Demo)',
    paymentReference: 'THN-2026-9104',
    status: 'pendiente',
    createdAt: 'Hace 25 minutos',
  },
];

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-101',
    requestId: 'req-101',
    tutorId: 'tutor-1',
    tutorName: 'Ing. Alejandra Valladares',
    tutorHeadline: 'Catedrática de Cálculo, Álgebra Lineal y Preparación PAA',
    tutorPortraitUrl: INITIAL_TUTORS[0].portraitUrl,
    studentName: 'Valeria Paz',
    subject: 'Cálculo Diferencial e Integral (MM-201)',
    scheduledDate: 'Miércoles 28 de octubre, 2026',
    scheduledTime: '16:00',
    modality: 'Virtual',
    messages: [
      {
        id: 'msg-1',
        sender: 'sistema',
        senderName: 'TutorHn Garantía Académica',
        text: 'Solicitud #req-101 aceptada. El canal de mensajería directa entre Valeria Paz e Ing. Alejandra Valladares está habilitado.',
        timestamp: '14:10',
      },
      {
        id: 'msg-2',
        sender: 'tutor',
        senderName: 'Ing. Alejandra Valladares',
        text: '¡Hola Valeria! Con gusto te acompaño este miércoles a las 16:00. Ya revisé tu nota sobre integrales por partes y fracciones parciales. ¿Tienes a mano la guía de ejercicios de tu catedrático en la UNAH?',
        timestamp: '14:12',
      },
      {
        id: 'msg-3',
        sender: 'estudiante',
        senderName: 'Valeria Paz',
        text: '¡Hola Ingeniera! Sí, tengo los 12 ejercicios de la guía unificada del segundo parcial. Sobre todo me cuestan los casos con factores cuadráticos irreducibles.',
        timestamp: '14:16',
      },
      {
        id: 'msg-4',
        sender: 'tutor',
        senderName: 'Ing. Alejandra Valladares',
        text: 'Excelente, preparé una pizarra con 4 ejercicios tipo examen de ese tema exacto para que los resolvamos paso a paso en la sesión.',
        timestamp: '14:18',
      },
    ],
  },
];

export const DEFAULT_USER: CurrentUser = {
  id: 'user-valeria',
  name: 'Valeria Paz',
  email: 'valeria.paz@unah.hn',
  role: 'estudiante',
  city: 'Tegucigalpa',
};
