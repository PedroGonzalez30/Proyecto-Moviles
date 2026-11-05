import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Equipo, Estilo, Serie } from '../types';
import { guardarSesion } from '../storage/sesiones';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { colores, Esquinas, sombra } from '../components/temas';

const ESTILOS: Estilo[] = ['crol', 'dorso', 'pecho', 'mariposa', 'combinado'];
const EQUIPO: Equipo[] = ['aletas', 'paletas', 'pullbuoy', 'tabla', 'snorkel'];

type Props = NativeStackScreenProps<RootStackParamList, 'RegistroSesion'>;

export default function RegistroSesion({ navigation }: Props) {
    const [duracionMin, setDuracionMin] = useState('');
    const [series, setSeries] = useState<Serie[]>([]);

    const [repeticiones, setRepeticiones] = useState('');
    const [distancia, setDistancia] = useState('');
    const [estilo, setEstilo] = useState<Estilo>('crol');
    const [intervaloSeg, setIntervaloSeg] = useState('');
    const [descansoSeg, setDescansoSeg] = useState('');
    const [equipo, setEquipo] = useState<Equipo | null>(null);

    const agregarEjercicio = () => {
        if (!repeticiones || !distancia) return;

        const nuevaSerie: Serie = {
            repeticiones: Number(repeticiones),
            distancia: Number(distancia),
            estilo,
            intervaloSeg: intervaloSeg ? Number(intervaloSeg) : undefined,
            descansoSeg: descansoSeg ? Number(descansoSeg) : undefined,
            equipo: equipo || undefined,
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

                    <Text style={styles.label}>Equipo</Text>
                    <View style={styles.estilosFila}>
                        {EQUIPO.map((e) => (
                            <TouchableOpacity
                                key={e}
                                style={[styles.estiloChip, equipo === e && styles.estiloChipActivo]}
                                onPress={() => setEquipo(e)}
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
        backgroundColor: colores.fondo,
    },
    scroll: {
        padding: 16,
    },
    titulo: {
        marginBottom: 16,
        fontSize: 24,
        fontWeight: 'bold',
        color: colores.texto,
    },
    subtitulo: {
        marginTop: 16,
        marginBottom: 8,
        fontSize: 18,
        fontWeight: 'bold',
        color: colores.texto,
    },
    label: {
        marginTop: 8,
        marginBottom: 4,
        fontSize: 14,
        color: colores.textoSecundario,
    },
    input: {
        padding: 10,
        borderRadius: Esquinas.tarjeta,
        backgroundColor: colores.tarjeta,
        color: colores.texto,
        borderWidth: 1,
        borderColor: colores.borde,
    },
    card: {
        marginBottom: 8,
        padding: 12,
        borderRadius: Esquinas.tarjeta,
        borderWidth: 1,
        borderColor: colores.acento,
        backgroundColor: colores.tarjeta,
    },
    cardTexto: {
        fontSize: 14,
        color: colores.texto,
        borderWidth: 1,
        borderColor: colores.borde,
    },
    formEjercicio: {
        marginTop: 16,
        padding: 12,
        borderRadius: Esquinas.tarjeta,
        backgroundColor: colores.tarjeta,
        borderWidth: 1,
        borderColor: colores.acento,
    },
    estilosFila: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    estiloChip: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: Esquinas.pildora,
        backgroundColor: colores.tarjeta,
        borderWidth: 1,
        borderColor: colores.acento,
    },
    estiloChipActivo: {
        backgroundColor: colores.acento,
        borderWidth: 1,
        borderColor: colores.acento,
    },
    estiloTexto: {
        fontSize: 13,
        color: colores.texto,
    },
    boton: {
        marginTop: 16,
        padding: 12,
        borderRadius: Esquinas.tarjeta,
        backgroundColor: colores.tarjeta,
        borderWidth: 1,
        borderColor: colores.acento,
        alignItems: 'center',
    },
    botonGuardar: {
        marginTop: 24,
        padding: 14,
        borderRadius: Esquinas.pildora,
        backgroundColor: colores.acento,
        alignItems: 'center',
    },
    botonTexto: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colores.texto,
    },
});