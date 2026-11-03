import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { obtenerSesiones } from '../storage/sesiones';
import { Sesion } from '../types';

export default function Historial() {
  const [sesiones, setSesiones] = useState<Sesion[]>([]);

  useEffect(() => {
    const cargarSesiones = async () => {
      const datos = await obtenerSesiones();
      setSesiones(datos.reverse());
    };
    cargarSesiones();
  }, []);

  const renderSesion = ({ item }: { item: Sesion }) => (
    <View style={styles.card}>
      <Text style={styles.fecha}>{new Date(item.fecha).toLocaleDateString()}</Text>
      <Text style={styles.detalle}>
        {item.duracionMin} min · {item.series.length} ejercicios
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={sesiones}
        renderItem={renderSesion}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.vacio}>Aún no hay sesiones registradas</Text>}
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
  fecha: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  detalle: {
    marginTop: 4,
    fontSize: 14,
    color: '#7FDBFF',
  },
  vacio: {
    marginTop: 40,
    textAlign: 'center',
    fontSize: 16,
    color: '#FFFFFF',
  },
});