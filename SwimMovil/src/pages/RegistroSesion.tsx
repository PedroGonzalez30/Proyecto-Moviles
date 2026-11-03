import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Estilo, Serie } from '../types';
import { guardarSesion } from '../storage/sesiones';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

const ESTILOS: Estilo[] = ['crol', 'dorso', 'pecho', 'mariposa', 'combinado'];

type Props = NativeStackScreenProps<RootStackParamList, 'RegistroSesion'>;

export default function RegistroSesion({ navigation }: Props) {
  const [duracionMin, setDuracionMin] = useState('');
  const [series, setSeries] = useState<Serie[]>([]);

  const [repeticiones, setRepeticiones] = useState('');
  const [distancia, setDistancia] = useState('');
  const [estilo, setEstilo] = useState<Estilo>('crol');
  const [intervaloSeg, setIntervaloSeg] = useState('');
  const [descansoSeg, setDescansoSeg] = useState('');

  const agregarEjercicio = () => {
    if (!repeticiones || !distancia) return;

    const nuevaSerie: Serie = {
      repeticiones: Number(repeticiones),
      distancia: Number(distancia),
      estilo,
      intervaloSeg: intervaloSeg ? Number(intervaloSeg) : undefined,
      descansoSeg: descansoSeg ? Number(descansoSeg) : undefined,
    };

    setSeries([...series, nuevaSerie]);
    setRepeticiones('');
    setDistancia('');
    setIntervaloSeg('');
    setDescansoSeg('');
  };

  const handleGuardar = async () => {
    try {
      const sesion = {
        id: Date.now().toString(),
        fecha: new Date().toISOString(),
        duracionMin: Number(duracionMin),
        series,
      };

      await guardarSesion(sesion);

        Alert.alert('Listo', 'La sesión se guardó correctamente.', [
        { text: 'OK', onPress: () => navigation.replace('Historial') },
        ]);
        
      setDuracionMin('');
      setSeries([]);
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar la sesión. Intenta de nuevo.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.titulo}>Registrar sesión</Text>

        <Text style={styles.label}>Duración total (min)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={duracionMin}
          onChangeText={setDuracionMin}
          placeholder="Ej. 45"
          placeholderTextColor="#7FDBFF"
        />

        <Text style={styles.subtitulo}>Ejercicios</Text>
        {series.map((s, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.cardTexto}>
              {s.repeticiones} x {s.distancia}m — {s.estilo}
            </Text>
          </View>
        ))}

        <View style={styles.formEjercicio}>
          <Text style={styles.label}>Repeticiones</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={repeticiones}
            onChangeText={setRepeticiones}
            placeholder="Ej. 8"
            placeholderTextColor="#7FDBFF"
          />

          <Text style={styles.label}>Distancia (m)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={distancia}
            onChangeText={setDistancia}
            placeholder="Ej. 50"
            placeholderTextColor="#7FDBFF"
          />

          <Text style={styles.label}>Estilo</Text>
          <View style={styles.estilosFila}>
            {ESTILOS.map((e) => (
              <TouchableOpacity
                key={e}
                style={[styles.estiloChip, estilo === e && styles.estiloChipActivo]}
                onPress={() => setEstilo(e)}
              >
                <Text style={styles.estiloTexto}>{e}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Intervalo (seg, opcional)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={intervaloSeg}
            onChangeText={setIntervaloSeg}
            placeholder="Ej. 60"
            placeholderTextColor="#7FDBFF"
          />

          <Text style={styles.label}>Descanso (seg, opcional)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={descansoSeg}
            onChangeText={setDescansoSeg}
            placeholder="Ej. 30"
            placeholderTextColor="#7FDBFF"
          />

          <TouchableOpacity style={styles.boton} onPress={agregarEjercicio}>
            <Text style={styles.botonTexto}>+ Agregar ejercicio</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.botonGuardar} onPress={handleGuardar}>
          <Text style={styles.botonTexto}>Guardar sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A2540',
  },
  scroll: {
    padding: 16,
  },
  titulo: {
    marginBottom: 16,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subtitulo: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  label: {
    marginTop: 8,
    marginBottom: 4,
    fontSize: 14,
    color: '#7FDBFF',
  },
  input: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#123A63',
    color: '#FFFFFF',
  },
  card: {
    marginBottom: 8,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#123A63',
  },
  cardTexto: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  formEjercicio: {
    marginTop: 16,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#0F2E4F',
  },
  estilosFila: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  estiloChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: '#123A63',
  },
  estiloChipActivo: {
    backgroundColor: '#7FDBFF',
  },
  estiloTexto: {
    fontSize: 13,
    color: '#FFFFFF',
  },
  boton: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#123A63',
    alignItems: 'center',
  },
  botonGuardar: {
    marginTop: 24,
    padding: 14,
    borderRadius: 999,
    backgroundColor: '#7FDBFF',
    alignItems: 'center',
  },
  botonTexto: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});