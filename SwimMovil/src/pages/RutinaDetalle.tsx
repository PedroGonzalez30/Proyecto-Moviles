import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { rutinas } from '../data/rutinas';
import { RootStackParamList } from '../types/navigation';
import { Serie } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'RutinaDetalle'>;

export default function RutinaDetalle({ route }: Props) {
  const { id } = route.params;
  const rutina = rutinas.find((r) => r.id === id);

  if (!rutina) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.nombre}>Rutina no encontrada</Text>
      </SafeAreaView>
    );
  }

  const renderSerie = ({ item, index }: { item: Serie; index: number }) => (
    <View style={styles.card}>
      <Text style={styles.serieTitulo}>Serie {index + 1}</Text>
      <Text style={styles.serieTexto}>
        {item.repeticiones} x {item.distancia}m — {item.estilo}
      </Text>
      {item.intervaloSeg && (
        <Text style={styles.serieTexto}>Intervalo: {item.intervaloSeg}s</Text>
      )}
      {item.descansoSeg && (
        <Text style={styles.serieTexto}>Descanso: {item.descansoSeg}s</Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.nombre}>{rutina.nombre}</Text>
      <FlatList
        data={rutina.series}
        renderItem={renderSerie}
        keyExtractor={(_, index) => index.toString()}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A2540',
  },
  nombre: {
    marginHorizontal: 16,
    marginVertical: 16,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#123A63',
  },
  serieTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  serieTexto: {
    marginTop: 2,
    fontSize: 14,
    color: '#7FDBFF',
  },
});