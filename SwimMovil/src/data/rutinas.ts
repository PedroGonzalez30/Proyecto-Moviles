import { Rutina } from '../types';
import datos from './rutinas.json';

export function obtenerRutinas(): Rutina[] {
  return datos as Rutina[];
}