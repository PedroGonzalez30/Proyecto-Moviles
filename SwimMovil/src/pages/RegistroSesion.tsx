import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Equipo, Estilo, Serie, Sesion } from '../types';
import { guardarSesion } from '../storage/sesiones';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { colores, Esquinas } from '../components/temas';
import Chip from '../components/Chip';

const ESTILOS: Estilo[] = ['crol', 'dorso', 'pecho', 'mariposa', 'combinado'];
const EQUIPO: Equipo[] = ['aletas', 'paletas', 'pullbuoy', 'tabla', 'snorkel'];
const DISTANCIAS = ['25', '50', '100', '200', '400', 'Otro'];

// "130" -> 90 segundos; "45" -> 45 segundos
const aSegundos = (d: string): number | undefined => {
    if (!d) return undefined;
    const n = Number(d);
    const total = Math.floor(n / 100) * 60 + (n % 100);
    return total > 0 ? total : undefined;
};

// "130" -> "1:30"; con 1 o 2 dígitos se deja igual
const formatoTiempo = (d: string) =>
    d.length <= 2 ? d : `${d.slice(0, -2)}:${d.slice(-2)}`;

type Props = NativeStackScreenProps<RootStackParamList, 'RegistroSesion'>;

export default function RegistroSesion({ navigation }: Props) {
    const [duracionMin, setDuracionMin] = useState('');
    const [series, setSeries] = useState<Serie[]>([]);

    const [repeticiones, setRepeticiones] = useState('');
    const [distancia, setDistancia] = useState('');
    const [distanciaOtro, setDistanciaOtro] = useState('');
    const [estilo, setEstilo] = useState<Estilo>('crol');
    const [intervalo, setIntervalo] = useState('');
    const [descanso, setDescanso] = useState('');
    const [equipo, setEquipo] = useState<Equipo | null>(null);
    const [mostrarEquipo, setMostrarEquipo] = useState(false);

    const agregarEjercicio = () => {
        const metros = Number(distancia === 'Otro' ? distanciaOtro : distancia);
        if (!repeticiones || !metros) return;

        const nuevaSerie: Serie = {
            repeticiones: Number(repeticiones),
            distancia: metros,
            estilo,
            intervaloSeg: aSegundos(intervalo),
            descansoSeg: aSegundos(descanso),
            equipo: equipo || undefined,
        };

        setSeries([...series, nuevaSerie]);
        setRepeticiones('');
        setDistancia('');
        setDistanciaOtro('');
        setIntervalo('');
        setDescanso('');
    };

    const handleGuardar = async () => {
        try {
            const sesion: Sesion = {
                id: Date.now().toString(),
                fecha: new Date().toISOString(),
                duracionMin: Number(duracionMin),
                series,
                origen: 'manual',
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
        <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
            <KeyboardAvoidingView style={styles.container} behavior="padding">
                <ScrollView contentContainerStyle={styles.scroll}>
                    <Text style={styles.titulo}>Registrar sesión</Text>

                    <Text style={styles.label}>Duración total (min)</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={duracionMin}
                        onChangeText={setDuracionMin}
                        placeholder="Ej. 45"
                        placeholderTextColor={colores.textoSecundario}
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
                            placeholderTextColor={colores.textoSecundario}
                        />

                        <Text style={styles.label}>Distancia (m)</Text>
                        <Chip
                            opciones={DISTANCIAS}
                            seleccionados={[distancia]}
                            onToggle={(o) => setDistancia(o === distancia ? '' : o)}
                        />
                        {distancia === 'Otro' && (
                            <TextInput
                                style={styles.inputOtro}
                                keyboardType="numeric"
                                value={distanciaOtro}
                                onChangeText={setDistanciaOtro}
                                placeholder="Ej. 150"
                                placeholderTextColor={colores.textoSecundario}
                            />
                        )}

                        <Text style={styles.label}>Estilo</Text>
                        <Chip opciones={ESTILOS} seleccionados={[estilo]} onToggle={setEstilo} />

                        <View style={styles.filaTiempos}>
                            <View style={styles.campoTiempo}>
                                <Text style={styles.label}>Intervalo</Text>
                                <TextInput
                                    style={styles.input}
                                    keyboardType="numeric"
                                    maxLength={5}
                                    value={formatoTiempo(intervalo)}
                                    onChangeText={(t) => setIntervalo(t.replace(/\D/g, ''))}
                                    placeholder="Ej. 1:30"
                                    placeholderTextColor={colores.textoSecundario}
                                />
                            </View>
                            <View style={styles.campoTiempo}>
                                <Text style={styles.label}>Descanso</Text>
                                <TextInput
                                    style={styles.input}
                                    keyboardType="numeric"
                                    maxLength={5}
                                    value={formatoTiempo(descanso)}
                                    onChangeText={(t) => setDescanso(t.replace(/\D/g, ''))}
                                    placeholder="Ej. 0:30"
                                    placeholderTextColor={colores.textoSecundario}
                                />
                            </View>
                        </View>

                        <TouchableOpacity onPress={() => setMostrarEquipo(!mostrarEquipo)}>
                            <Text style={styles.enlace}>
                                {mostrarEquipo ? '− Equipo' : '+ Equipo (opcional)'}
                            </Text>
                        </TouchableOpacity>
                        {mostrarEquipo && (
                            <Chip
                                opciones={EQUIPO}
                                seleccionados={equipo ? [equipo] : []}
                                onToggle={(e) => setEquipo(e === equipo ? null : e)}
                            />
                        )}

                        <TouchableOpacity style={styles.boton} onPress={agregarEjercicio}>
                            <Text style={styles.botonTexto}>+ Agregar ejercicio</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.botonGuardar} onPress={handleGuardar}>
                        <Text style={styles.botonGuardarTexto}>Guardar sesión</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
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
        marginTop: 12,
        marginBottom: 6,
        fontSize: 14,
        color: colores.textoSecundario,
    },
    input: {
        padding: 10,
        borderRadius: Esquinas.tarjeta,
        borderWidth: 1,
        borderColor: colores.borde,
        backgroundColor: colores.tarjeta,
        color: colores.texto,
    },
    inputOtro: {
        marginTop: 8,
        padding: 10,
        borderRadius: Esquinas.tarjeta,
        borderWidth: 1,
        borderColor: colores.borde,
        backgroundColor: colores.tarjeta,
        color: colores.texto,
    },
    filaTiempos: {
        flexDirection: 'row',
        gap: 12,
    },
    campoTiempo: {
        flex: 1,
    },
    enlace: {
        marginVertical: 12,
        fontSize: 14,
        fontWeight: 'bold',
        color: colores.acento,
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
    },
    formEjercicio: {
        marginTop: 16,
        padding: 12,
        borderRadius: Esquinas.tarjeta,
        borderWidth: 1,
        borderColor: colores.borde,
        backgroundColor: colores.tarjeta,
    },
    boton: {
        marginTop: 16,
        padding: 12,
        alignItems: 'center',
        borderRadius: Esquinas.pildora,
        borderWidth: 1,
        borderColor: colores.acento,
        backgroundColor: colores.tarjeta,
    },
    botonGuardar: {
        marginTop: 24,
        padding: 14,
        alignItems: 'center',
        borderRadius: Esquinas.pildora,
        backgroundColor: colores.acento,
    },
    botonTexto: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colores.acento,
    },
    botonGuardarTexto: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
});