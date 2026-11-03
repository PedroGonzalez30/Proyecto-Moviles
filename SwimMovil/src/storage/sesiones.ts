import AsyncStorage from '@react-native-async-storage/async-storage';
import { Sesion } from '../types';

const CLAVE_SESIONES = 'sesiones';
const CLAVE_BORRADAS = 'sesionesBorradas';

export async function guardarSesion(sesion: Sesion): Promise<void> {
  const sesiones = await obtenerSesiones();
  if (sesiones.some((s) => s.id === sesion.id)) return;
  const borradas = await obtenerBorradas();
    if (borradas.includes(sesion.id)) return;
  const nuevasSesiones = [...sesiones, sesion];
  await AsyncStorage.setItem(CLAVE_SESIONES, JSON.stringify(nuevasSesiones));
}

export async function obtenerSesiones(): Promise<Sesion[]> {
  const datos = await AsyncStorage.getItem(CLAVE_SESIONES);
  return datos ? JSON.parse(datos) : [];
}

export async function borrarSesion(id: string): Promise<void> {
  const sesiones = await obtenerSesiones();
  const nuevasSesiones = sesiones.filter((s) => s.id !== id);
  const borradas = await obtenerBorradas();
  await AsyncStorage.setItem(CLAVE_BORRADAS, JSON.stringify([...borradas, id]));
  await AsyncStorage.setItem(CLAVE_SESIONES, JSON.stringify(nuevasSesiones));
}

export async function borrarSesiones(): Promise<void> {
  await AsyncStorage.removeItem(CLAVE_SESIONES);
}

async function obtenerBorradas(): Promise<string[]> {
  const datos = await AsyncStorage.getItem(CLAVE_BORRADAS);
  return datos ? JSON.parse(datos) : [];
}

