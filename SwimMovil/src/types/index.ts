export type Objetivo = 'velocidad' | 'mediofondo' | 'fondo';

export type Estilo = 'crol' | 'dorso' | 'pecho' | 'mariposa' | 'combinado';

export type Equipo = 'aletas' | 'paletas' | 'pullbuoy' | 'tabla' | 'snorkel';

export type Serie = {
  repeticiones: number;
  distancia: number;   // Metros 
  estilo: Estilo;
  equipo?: Equipo;
  intervaloSeg?: number;
  descansoSeg?: number;
  intensidad?: string;
  descripcion?: string;
};

export type Rutina = {
  id: string;
  nombre: string;
  objetivo: Objetivo;
  distanciaTotal: number;
  piscinaMetros?: number;
  calentamiento: Serie[];
  principal: Serie[];
  vueltaCalma: Serie[];
};

export type Sesion = {
  id: string;
  fecha: string;
  duracionMin: number;
  series: Serie[];
  rutinaId?: string;
  origen?: 'manual' | 'reloj';
};

export type Usuario = {
  id: string;
  nombre: string;
  correo: string;
  contrasena: string;
};

export type Perfil = {
  objetivo: Objetivo;
  diasPorSemana: number;
  duracionSesionMin: number;
  metrosPorSesion: number;
  estilos: Estilo[];
  equipo: Equipo[];
};

