export type Objetivo = 'velocidad' | 'mediofondo' | 'fondo';

export type Estilo = 'crol' | 'dorso' | 'pecho' | 'mariposa' | 'combinado';

export type Serie = {
  repeticiones: number;
  distancia: number;   // Metros 
  estilo: Estilo;
  intervaloSeg?: number;
  descansoSeg?: number;
};

export type Rutina = {
  id: string;
  nombre: string;
  objetivo: Objetivo;
  series: Serie[];
};

export type Sesion = {
  id: string;
  fecha: string;
  duracionMin: number;
  series: Serie[];
  rutinaId?: string;
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
};