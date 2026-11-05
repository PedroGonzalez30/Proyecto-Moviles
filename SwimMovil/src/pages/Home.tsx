import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colores, Esquinas, sombra } from '../components/temas';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const actividades = [
  { texto: 'Rutinas', destino: 'Rutinas' },
  { texto: 'Registrar', destino: 'RegistroSesion' },
  { texto: 'Historial', destino: 'Historial' },
] as const;

export default function Home({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <View style={styles.barra}>
        {actividades.map((a) => (
          <TouchableOpacity
            key={a.texto}
            style={styles.actividad}
            onPress={() => navigation.navigate(a.destino)}
          >
            <Text style={styles.actividadTexto}>{a.texto}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitulo}>Último entreno</Text>
        <Text style={styles.panelTexto}>Aún no hay datos</Text>
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitulo}>Objetivo de la semana</Text>
        <Text style={styles.panelTexto}>Aún no hay datos</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colores.fondo,
  },
  barra: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 6,
    borderRadius: Esquinas.pildora,
    borderWidth: 1,
    borderColor: colores.borde,
    backgroundColor: colores.tarjeta,
  },
  actividad: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: Esquinas.pildora,
  },
  actividadTexto: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colores.primario,
  },
  panel: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: Esquinas.tarjeta,
    backgroundColor: colores.tarjeta,
    ...sombra,
  },
  panelTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colores.texto,
  },
  panelTexto: {
    marginTop: 4,
    fontSize: 14,
    color: colores.textoSecundario,
  },
});