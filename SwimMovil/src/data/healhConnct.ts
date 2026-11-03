import { initialize, requestPermission, readRecords } from 'react-native-health-connect';

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