import AsyncStorage from '@react-native-async-storage/async-storage';
import { Sesion } from '../types';

const CLAVE_SESIONES = 'sesiones';

export async function guardarSesion(sesion: Sesion): Promise<void> {
  const sesiones = await obtenerSesiones();
  const nuevasSesiones = [...sesiones, sesion];
  await AsyncStorage.setItem(CLAVE_SESIONES, JSON.stringify(nuevasSesiones));
}

export async function obtenerSesiones(): Promise<Sesion[]> {
  const datos = await AsyncStorage.getItem(CLAVE_SESIONES);
  return datos ? JSON.parse(datos) : [];
}