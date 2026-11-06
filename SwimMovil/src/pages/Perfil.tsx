import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Chip from '../components/Chip';
import { convertirARegistroSesion, leerEjerciciosReloj, relojVinculado } from '../data/healhConnct';
import { guardarPerfil, obtenerPerfil } from '../storage/perfil';
import { guardarSesion } from '../storage/sesiones';
import { cerrarSesion, haySesionActiva, obtenerUsuario } from '../storage/usuario';
import { Esquinas, colores, sombra } from '../components/temas';
import { Equipo, Estilo, Objetivo, Usuario } from '../types';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Perfil'>;

const OBJETIVOS: Objetivo[] = ['velocidad', 'mediofondo', 'fondo'];
const ESTILOS: Estilo[] = ['crol', 'dorso', 'pecho', 'mariposa'];
const EQUIPOS: Equipo[] = ['aletas', 'paletas', 'pullbuoy', 'tabla', 'snorkel'];

export default function Perfil({ navigation }: Props) {
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [objetivo, setObjetivo] = useState<Objetivo>('velocidad');
    const [dias, setDias] = useState('3');
    const [duracion, setDuracion] = useState('60');
    const [metros, setMetros] = useState('1000');
    const [estilos, setEstilos] = useState<Estilo[]>(['crol']);
    const [equipo, setEquipo] = useState<Equipo[]>([]);
    const [relojOk, setRelojOk] = useState(false);

    useEffect(() => {
        const cargar = async () => {
            if (await haySesionActiva()) setUsuario(await obtenerUsuario());
            const perfil = await obtenerPerfil();
            if (perfil) {
                setObjetivo(perfil.objetivo);
                setDias(String(perfil.diasPorSemana));
                setDuracion(String(perfil.duracionSesionMin));
                setMetros(String(perfil.metrosPorSesion ?? 1000));
                setEstilos(perfil.estilos ?? ['crol']);
                setEquipo(perfil.equipo ?? []);
            }
            setRelojOk(await relojVinculado());
        };
        cargar();
    }, []);

    const alternar = <T,>(lista: T[], valor: T, set: (l: T[]) => void) =>
        set(lista.includes(valor) ? lista.filter((x) => x !== valor) : [...lista, valor]);

    const handleGuardar = async () => {
        const d = Number(dias);
        const m = Number(duracion);
        const mt = Number(metros);
        if (!(d >= 1 && d <= 7) || !(m > 0) || !(mt > 0) || estilos.length < 1) {
            Alert.alert('Datos inválidos', 'Días 1-7, duración y metros mayores a 0, y al menos un estilo.');
            return;
        }
        await guardarPerfil({
            objetivo,
            diasPorSemana: d,
            duracionSesionMin: m,
            metrosPorSesion: mt,
            estilos,
            equipo,
        });
        Alert.alert('Listo', 'Perfil guardado.', [
            { text: 'OK', onPress: () => navigation.popToTop() },
        ]);
    };

    const handleVincular = async () => {
        try {
            const registros = await leerEjerciciosReloj();
            setRelojOk(await relojVinculado());
            for (const r of registros) await guardarSesion(convertirARegistroSesion(r));
            Alert.alert('Listo', `Se revisaron ${registros.length} sesión(es) del reloj.`);
        } catch (e) {
            Alert.alert('Error', String(e));
        }
    };

    const handleCerrarSesion = async () => {
        await cerrarSesion();
        navigation.popToTop();
    };

    if (!usuario) {
        return (
            <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
                <View style={styles.contenido}>
                    <Text style={styles.titulo}>Tu cuenta</Text>
                    <View style={styles.filaBotones}>
                        <TouchableOpacity style={styles.boton} onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.botonTexto}>Iniciar sesión</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.botonSecundario} onPress={() => navigation.navigate('Registro')}>
                            <Text style={styles.botonSecundarioTexto}>Registrarse</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
            <KeyboardAvoidingView style={styles.container} behavior="padding">
                <ScrollView contentContainerStyle={styles.contenido} keyboardShouldPersistTaps="handled">
                    <Text style={styles.titulo}>Hola, {usuario.nombre}</Text>

                    <View style={styles.panel}>
                        <Text style={styles.etiqueta}>Objetivo</Text>
                        <Chip opciones={OBJETIVOS} seleccionados={[objetivo]} onToggle={setObjetivo} />

                        <View style={styles.filaCampos}>
                            <View style={styles.campo}>
                                <Text style={styles.etiqueta}>Días por semana</Text>
                                <TextInput style={styles.input} value={dias} onChangeText={setDias} keyboardType="numeric" />
                            </View>
                            <View style={styles.campo}>
                                <Text style={styles.etiqueta}>Duración (min)</Text>
                                <TextInput style={styles.input} value={duracion} onChangeText={setDuracion} keyboardType="numeric" />
                            </View>
                        </View>

                        <Text style={styles.etiqueta}>Metros totales por sesión</Text>
                        <TextInput style={styles.input} value={metros} onChangeText={setMetros} keyboardType="numeric" />

                        <Text style={styles.etiqueta}>Estilos que nadas</Text>
                        <Chip opciones={ESTILOS} seleccionados={estilos} onToggle={(e) => alternar(estilos, e, setEstilos)} />

                        <Text style={styles.etiqueta}>Equipo disponible</Text>
                        <Chip opciones={EQUIPOS} seleccionados={equipo} onToggle={(e) => alternar(equipo, e, setEquipo)} />

                        <TouchableOpacity style={styles.boton} onPress={handleGuardar}>
                            <Text style={styles.botonTexto}>Guardar perfil</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.panel}>
                        <Text style={styles.subtitulo}>Reloj</Text>
                        <Text style={styles.estadoReloj}>
                            {relojOk ? 'Conectado a Health Connect' : 'No conectado'}
                        </Text>
                        <TouchableOpacity style={styles.botonSecundario} onPress={handleVincular}>
                            <Text style={styles.botonSecundarioTexto}>
                                {relojOk ? 'Sincronizar ahora' : 'Vincular reloj'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.botonSecundario} onPress={handleCerrarSesion}>
                        <Text style={styles.botonSecundarioTexto}>Cerrar sesión</Text>
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
    contenido: {
        padding: 16,
    },
    titulo: {
        marginBottom: 16,
        fontSize: 24,
        fontWeight: 'bold',
        color: colores.texto,
    },
    subtitulo: {
        marginBottom: 8,
        fontSize: 18,
        fontWeight: 'bold',
        color: colores.texto,
    },
    panel: {
        ...sombra,
        marginBottom: 16,
        padding: 16,
        borderRadius: Esquinas.tarjeta,
        backgroundColor: colores.tarjeta,
    },
    etiqueta: {
        marginTop: 12,
        marginBottom: 6,
        fontSize: 14,
        color: colores.textoSecundario,
    },
    filaCampos: {
        flexDirection: 'row',
        gap: 12,
    },
    campo: {
        flex: 1,
    },
    input: {
        padding: 10,
        borderRadius: Esquinas.tarjeta,
        borderWidth: 1,
        borderColor: colores.borde,
        backgroundColor: colores.tarjeta,
        fontSize: 16,
        color: colores.texto,
    },
    filaBotones: {
        flexDirection: 'row',
        gap: 8,
    },
    boton: {
        alignSelf: 'flex-start',
        marginTop: 20,
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: Esquinas.pildora,
        backgroundColor: colores.acento,
    },
    botonTexto: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    botonSecundario: {
        alignSelf: 'flex-start',
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: Esquinas.pildora,
        borderWidth: 1,
        borderColor: colores.acento,
    },
    botonSecundarioTexto: {
        fontSize: 15,
        fontWeight: 'bold',
        color: colores.acento,
    },
    estadoReloj: {
        marginBottom: 12,
        fontSize: 15,
        color: colores.textoSecundario,
    },
});