import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { obtenerRutinas } from '../data/rutinas';
import { Serie } from '../types';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'RutinaDetalle'>;

export default function RutinaDetalle({ route }: Props) {
    const { id } = route.params;
    const rutina = obtenerRutinas().find((r) => r.id === id);

    if (!rutina) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.nombre}>Rutina no encontrada</Text>
            </SafeAreaView>
        );
    }

    const bloque = (titulo: string, series: Serie[]) => (
        <View>
            <Text style={styles.bloque}>{titulo}</Text>
            {series.map((s, i) => (
                <View key={i} style={styles.card}>
                    <Text style={styles.serieTitulo}>
                        {s.repeticiones} x {s.distancia}m — {s.estilo}
                    </Text>
                    {s.equipo && <Text style={styles.serieTexto}>Equipo: {s.equipo}</Text>}
                    {s.intensidad && <Text style={styles.serieTexto}>Intensidad: {s.intensidad}</Text>}
                    {s.intervaloSeg && <Text style={styles.serieTexto}>Intervalo: {s.intervaloSeg}s</Text>}
                    {s.descansoSeg && <Text style={styles.serieTexto}>Descanso: {s.descansoSeg}s</Text>}
                    {s.descripcion && <Text style={styles.serieTexto}>{s.descripcion}</Text>}
                </View>
            ))}
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <Text style={styles.nombre}>{rutina.nombre}</Text>
                {bloque('Calentamiento', rutina.calentamiento)}
                {bloque('Principal', rutina.principal)}
                {bloque('Vuelta a la calma', rutina.vueltaCalma)}
            </ScrollView>
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
    bloque: {
        marginHorizontal: 16,
        marginBottom: 8,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#7FDBFF',
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