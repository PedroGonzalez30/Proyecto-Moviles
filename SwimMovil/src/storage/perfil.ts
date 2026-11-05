import AsyncStorage from '@react-native-async-storage/async-storage';
import { Perfil } from '../types';

const CLAVE_PERFIL = 'perfil';

export async function guardarPerfil(perfil: Perfil): Promise<void> {
    await AsyncStorage.setItem(CLAVE_PERFIL, JSON.stringify(perfil));
}

export async function obtenerPerfil(): Promise<Perfil | null> {
    const datos = await AsyncStorage.getItem(CLAVE_PERFIL);
    return datos ? JSON.parse(datos) : null;
}