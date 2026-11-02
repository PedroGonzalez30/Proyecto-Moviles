import { Rutina } from '../types';

export const rutinas: Rutina[] = [
  {
    id: '1',
    nombre: 'Rutina de Velocidad',
    objetivo: 'velocidad',
    series: [
      { repeticiones: 8, distancia: 50, estilo: 'crol', intervaloSeg: 60 },
      { repeticiones: 4, distancia: 25, estilo: 'mariposa', descansoSeg: 30 },
    ],
  },
  {
    id: '2',
    nombre: 'Rutina de Mediofondo',
    objetivo: 'mediofondo',
    series: [
      { repeticiones: 5, distancia: 200, estilo: 'crol', descansoSeg: 30 },
      { repeticiones: 4, distancia: 100, estilo: 'combinado', descansoSeg: 20 },
    ],
  },
  {
    id: '3',
    nombre: 'Rutina de Fondo',
    objetivo: 'fondo',
    series: [
      { repeticiones: 1, distancia: 1500, estilo: 'crol' },
      { repeticiones: 4, distancia: 100, estilo: 'dorso', descansoSeg: 15 },
    ],
  },
];