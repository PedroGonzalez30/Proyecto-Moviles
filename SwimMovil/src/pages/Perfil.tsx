import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { guardarPerfil, obtenerPerfil } from '../storage/perfil';
import { cerrarSesion, haySesionActiva, obtenerUsuario } from '../storage/usuario';
import { Objetivo, Usuario } from '../types';
import { RootStackParamList } from '../types/navigation';
import { convertirARegistroSesion, leerEjerciciosReloj, relojVinculado } from '../data/healhConnct';
import { guardarSesion } from '../storage/sesiones';

type Props = NativeStackScreenProps<RootStackParamList, 'Perfil'>;

const OBJETIVOS: Objetivo[] = ['velocidad', 'mediofondo', 'fondo'];

export default function Perfil({ navigation }: Props) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [objetivo, setObjetivo] = useState<Objetivo>('velocidad');
  const [dias, setDias] = useState('3');
  const [duracion, setDuracion] = useState('60');
  const [relojOk, setRelojOk] = useState(false);

  useEffect(() => {
    const cargar = async () => {
      if (await haySesionActiva()) setUsuario(await obtenerUsuario());
      const perfil = await obtenerPerfil();
      if (perfil) {
        setObjetivo(perfil.objetivo);
        setDias(String(perfil.diasPorSemana));
        setDuracion(String(perfil.duracionSesionMin));
        setRelojOk(await relojVinculado());
      }
    };
    cargar();
  }, []);

  const handleGuardar = async () => {
    const d = Number(dias);
    const m = Number(duracion);
    if (!(d >= 1 && d <= 7) || !(m > 0)) {
      Alert.alert('Datos inválidos', 'Días entre 1 y 7, y una duración mayor a 0.');
      return;
    }
    await guardarPerfil({ objetivo, diasPorSemana: d, duracionSesionMin: m });
    Alert.alert('Listo', 'Perfil guardado.', [
        { text: 'OK', onPress: () => navigation.popToTop() },]);
  };
  const handleVincular = async () => {
        try {
            const registros = await leerEjerciciosReloj();
            setRelojOk(await relojVinculado());
            for (const r of registros) await guardarSesion(convertirARegistroSesion(r));
            Alert.alert('Listo', `Se revisaron ${registros.length} sesión(es) del reloj.`);
        } catch (e) {
            Alert.alert('Error', String(e));
        }
    };

  const handleCerrarSesion = async () => {
    await cerrarSesion();
    navigation.popToTop();
  };

  if (!usuario) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.titulo}>Tu cuenta</Text>
        <TouchableOpacity style={styles.boton} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.botonTexto}>Iniciar sesión</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.botonSecundario} onPress={() => navigation.navigate('Registro')}>
          <Text style={styles.botonSecundarioTexto}>Registrarse</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.titulo}>Hola, {usuario.nombre}</Text>

        <Text style={styles.etiqueta}>Objetivo</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {OBJETIVOS.map((o) => (
            <TouchableOpacity
              key={o}
              style={[styles.chip, objetivo === o && styles.chipActivo]}
              onPress={() => setObjetivo(o)}
            >
              <Text style={[styles.chipTexto, objetivo === o && styles.chipTextoActivo]}>{o}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.etiqueta}>Días por semana</Text>
        <TextInput style={styles.input} value={dias} onChangeText={setDias} keyboardType="numeric" />

        <Text style={styles.etiqueta}>Duración de la sesión (min)</Text>
        <TextInput style={styles.input} value={duracion} onChangeText={setDuracion} keyboardType="numeric" />

        <Text style={styles.etiqueta}>Reloj</Text>
        <Text style={styles.estadoReloj}>
            {relojOk ? 'Conectado a Health Connect' : 'No conectado'}
        </Text>
        <TouchableOpacity style={styles.botonSecundario} onPress={handleVincular}>
            <Text style={styles.botonSecundarioTexto}>
                {relojOk ? 'Sincronizar ahora' : 'Vincular reloj'}
            </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.boton} onPress={handleGuardar}>
          <Text style={styles.botonTexto}>Guardar perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botonSecundario} onPress={handleCerrarSesion}>
          <Text style={styles.botonSecundarioTexto}>Cerrar sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#0A2540',
  },
  titulo: {
    marginBottom: 24,
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  etiqueta: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 14,
    color: '#7FDBFF',
  },
  input: {
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#123A63',
    fontSize: 16,
    color: '#FFFFFF',
  },
  chip: {
    marginRight: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#7FDBFF',
  },
  chipActivo: {
    backgroundColor: '#7FDBFF',
  },
  chipTexto: {
    fontSize: 14,
    color: '#7FDBFF',
  },
  chipTextoActivo: {
    fontWeight: 'bold',
    color: '#0A2540',
  },
  boton: {
    marginTop: 24,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 999,
    backgroundColor: '#7FDBFF',
  },
  botonTexto: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0A2540',
  },
  botonSecundario: {
    marginTop: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#7FDBFF',
  },
  botonSecundarioTexto: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7FDBFF',
  },
    estadoReloj: {
    marginBottom: 4,
    fontSize: 16,
    color: '#FFFFFF',
    },
});