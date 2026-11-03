import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Alert, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { RootStackParamList } from '../types/navigation';
import { SafeAreaView } from 'react-native-safe-area-context';
import { leerEjerciciosReloj, convertirARegistroSesion } from '../data/healhConnct';
import { guardarSesion } from '../storage/sesiones';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function Home({ navigation }: Props) {
  const probarReloj = async () => {
    try {
      const registros = await leerEjerciciosReloj();

      if (registros.length === 0) {
        Alert.alert('Sin datos', 'No se encontraron sesiones de ejercicio en Health Connect.');
        return;
      }

      for (const registro of registros) {
        const sesion = convertirARegistroSesion(registro);
        await guardarSesion(sesion);
      }

      Alert.alert('Listo', `Se importaron ${registros.length} sesión(es) del reloj.`);
      navigation.navigate('Historial');
    } catch (e) {
      Alert.alert('Error', String(e));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titulo}>SwimApp</Text>
      <Text style={styles.subtitulo}>Entrena tu natación</Text>

      <TouchableOpacity style={styles.boton} onPress={() => navigation.navigate('Rutinas')}>
        <Text style={styles.botonTexto}>Ver rutinas</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.botonSecundario} onPress={() => navigation.navigate('RegistroSesion')}>
        <Text style={styles.botonSecundarioTexto}>Registrar sesión</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.botonSecundario} onPress={() => navigation.navigate('Historial')}>
        <Text style={styles.botonSecundarioTexto}>Ver historial</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.botonSecundario} onPress={probarReloj}>
        <Text style={styles.botonSecundarioTexto}>Importar del reloj</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0A2540',
    padding: 24,
  },
  titulo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subtitulo: {
    marginTop: 8,
    fontSize: 18,
    color: '#7FDBFF',
  },
  boton: {
    marginTop: 32,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 999,
    backgroundColor: '#7FDBFF',
  },
  botonTexto: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0A2540',
  },
  botonSecundario: {
    marginTop: 16,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#7FDBFF',
  },
  botonSecundarioTexto: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7FDBFF',
  },
});