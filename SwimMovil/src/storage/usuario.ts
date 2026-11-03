import AsyncStorage from '@react-native-async-storage/async-storage';
import { Usuario } from '../types';

const CLAVE_USUARIO = 'usuario';
const CLAVE_ACTIVA = 'sesionActiva';

export async function registrarUsuario(usuario: Usuario): Promise<void> {
  await AsyncStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuario));
  await AsyncStorage.setItem(CLAVE_ACTIVA, 'true');
}

export async function obtenerUsuario(): Promise<Usuario | null> {
  const datos = await AsyncStorage.getItem(CLAVE_USUARIO);
  return datos ? JSON.parse(datos) : null;
}

export async function iniciarSesion(correo: string, contrasena: string): Promise<boolean> {
  const usuario = await obtenerUsuario();
  if (!usuario || usuario.correo !== correo || usuario.contrasena !== contrasena) {
    return false;
  }
  await AsyncStorage.setItem(CLAVE_ACTIVA, 'true');
  return true;
}

export async function cerrarSesion(): Promise<void> {
  await AsyncStorage.removeItem(CLAVE_ACTIVA);
}

export async function haySesionActiva(): Promise<boolean> {
  return (await AsyncStorage.getItem(CLAVE_ACTIVA)) === 'true';
}