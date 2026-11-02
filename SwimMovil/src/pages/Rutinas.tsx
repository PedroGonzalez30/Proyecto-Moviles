import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { rutinas } from '../data/rutinas';
import { Rutina } from '../types';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Rutinas'>;

export default function Rutinas({ navigation }: Props) {
  const renderRutina = ({ item }: { item: Rutina }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('RutinaDetalle', { id: item.id })}
    >
      <Text style={styles.nombre}>{item.nombre}</Text>
      <Text style={styles.series}>{item.series.length} series</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={rutinas}
        renderItem={renderRutina}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A2540',
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#123A63',
  },
  nombre: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  series: {
    marginTop: 4,
    fontSize: 14,
    color: '#7FDBFF',
  },
});