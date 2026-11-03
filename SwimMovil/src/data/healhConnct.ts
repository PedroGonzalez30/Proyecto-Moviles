import { initialize, requestPermission, readRecords,getGrantedPermissions,openHealthConnectSettings } from 'react-native-health-connect';
import { Sesion } from '../types';

export async function leerEjerciciosReloj() {
  const listo = await initialize();
  if (!listo) throw new Error('Health Connect no está disponible');

  await requestPermission([{ accessType: 'read', recordType: 'ExerciseSession' }]);

  const fin = new Date();
  const inicio = new Date(fin.getTime() - 7 * 24 * 60 * 60 * 1000);

  const resultado = await readRecords('ExerciseSession', {
    timeRangeFilter: {
      operator: 'between',
      startTime: inicio.toISOString(),
      endTime: fin.toISOString(),
    },
  });
  return resultado.records;
}

export function convertirARegistroSesion(registro: any): Sesion {
  const inicio = new Date(registro.startTime);
  const fin = new Date(registro.endTime);
  const duracionMin = Math.round((fin.getTime() - inicio.getTime()) / 60000);

  return {
    id: registro.metadata.id,
    fecha: registro.startTime,
    duracionMin,
    series: [],
  };
}

export async function relojVinculado(): Promise<boolean> {
  const listo = await initialize();
  if (!listo) return false;
  const permisos = await getGrantedPermissions();
  return permisos.some((p: any) => p.recordType === 'ExerciseSession');
}

export function abrirAjustesHealthConnect() {
  openHealthConnectSettings();
}