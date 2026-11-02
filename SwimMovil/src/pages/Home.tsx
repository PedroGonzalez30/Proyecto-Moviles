import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { RootStackParamList } from '../types/navigation';
import {SafeAreaView} from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function Home({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titulo}>SwimApp</Text>
      <Text style={styles.subtitulo}>Entrena natación</Text>

      <TouchableOpacity style={styles.boton} onPress={() => navigation.navigate('Rutinas')}>
        <Text style={styles.botonTexto}>Ver rutinas</Text>
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
    backgroundColor: '#7FDBFF',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 999,
  },
  botonTexto: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0A2540',
  },
});