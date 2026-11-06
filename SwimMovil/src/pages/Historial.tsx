import { useEffect, useState } from 'react';
import { Alert, FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { obtenerRutinas } from '../data/rutinas';
import { borrarSesion, obtenerSesiones, vincularRutina } from '../storage/sesiones';
import { Esquinas, colores, sombra } from '../components/temas';
import { Sesion } from '../types';
import Chip from '../components/Chip';

type Filtro = 'Todas' | 'Reloj' | 'Manual';
const FILTROS: Filtro[] = ['Todas', 'Reloj', 'Manual'];


export default function Historial() {
    const [sesiones, setSesiones] = useState<Sesion[]>([]);
    const [sesionAVincular, setSesionAVincular] = useState<string | null>(null);
    const [filtro, setFiltro] = useState<Filtro>('Todas');

    const visibles = sesiones.filter((s) =>
        filtro === 'Todas' ? true : s.origen === filtro.toLowerCase()
    );


    const cargarSesiones = async () => {
        const datos = await obtenerSesiones();
        setSesiones(datos.reverse());
    };

    useEffect(() => {
        cargarSesiones();
    }, []);

    const confirmarBorrado = (id: string) => {
        Alert.alert(
            'Borrar sesión',
            '¿Seguro que quieres borrar esta sesión? Esta acción no se puede deshacer.',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Borrar',
                    style: 'destructive',
                    onPress: async () => {
                        await borrarSesion(id);
                        setSesiones((prev) => prev.filter((s) => s.id !== id));
                    },
                },
            ]
        );
    };

    const nombreRutina = (id: string) =>
        obtenerRutinas().find((r) => r.id === id)?.nombre ?? 'Rutina';

    const elegirRutina = async (rutinaId: string) => {
        if (sesionAVincular) {
            await vincularRutina(sesionAVincular, rutinaId);
            await cargarSesiones();
        }
        setSesionAVincular(null);
    };

    const renderSesion = ({ item }: { item: Sesion }) => (
        <View style={styles.card}>
            <View style={styles.cardInfo}>
                <Text style={styles.fecha}>{new Date(item.fecha).toLocaleDateString()}</Text>
                <Text style={styles.detalle}>
                    {item.duracionMin} min · {item.origen === 'reloj' ? 'Reloj' : `Manual · ${item.series.length} ejercicios`}
                </Text>
                {item.origen === 'reloj' && (
                    <TouchableOpacity onPress={() => setSesionAVincular(item.id)}>
                        <Text style={styles.vincular}>
                            {item.rutinaId ? `${nombreRutina(item.rutinaId)} · Cambiar` : 'Sin rutina · Vincular rutina'}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
            <TouchableOpacity onPress={() => confirmarBorrado(item.id)}>
                <Text style={styles.borrarTexto}>Borrar</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>

            <View style={styles.filtros}>
                <Chip opciones={FILTROS} seleccionados={[filtro]} onToggle={setFiltro} />
            </View>


            <FlatList
                data={visibles}
                renderItem={renderSesion}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.lista}
                ListEmptyComponent={
                    <Text style={styles.vacio}>
                        {filtro === 'Todas' ? 'Aún no hay sesiones registradas' : `No hay sesiones de ${filtro.toLowerCase()}`}
                    </Text>
                } />

            <Modal
                visible={sesionAVincular !== null}
                transparent
                animationType="fade"
                onRequestClose={() => setSesionAVincular(null)}
            >
                <View style={styles.modalFondo}>
                    <View style={styles.modalCaja}>
                        <Text style={styles.modalTitulo}>Elige la rutina</Text>
                        {obtenerRutinas().map((r) => (
                            <TouchableOpacity key={r.id} onPress={() => elegirRutina(r.id)}>
                                <Text style={styles.modalOpcion}>{r.nombre}</Text>
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity onPress={() => setSesionAVincular(null)}>
                            <Text style={styles.modalCancelar}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colores.fondo,
    },
    lista: {
        paddingTop: 16,
    },
    card: {
        ...sombra,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: 16,
        marginBottom: 12,
        padding: 16,
        borderRadius: Esquinas.tarjeta,
        backgroundColor: colores.tarjeta,
    },
    cardInfo: {
        flex: 1,
    },
    fecha: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colores.texto,
    },
    detalle: {
        marginTop: 4,
        fontSize: 14,
        color: colores.textoSecundario,
    },
    vincular: {
        marginTop: 8,
        fontSize: 14,
        fontWeight: 'bold',
        color: colores.acento,
    },
    borrarTexto: {
        marginLeft: 12,
        fontSize: 14,
        fontWeight: 'bold',
        color: colores.error,
    },
    vacio: {
        marginTop: 40,
        textAlign: 'center',
        fontSize: 16,
        color: colores.textoSecundario,
    },
    modalFondo: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalCaja: {
        padding: 20,
        borderRadius: Esquinas.tarjeta,
        backgroundColor: colores.tarjeta,
    },
    modalTitulo: {
        marginBottom: 12,
        fontSize: 18,
        fontWeight: 'bold',
        color: colores.texto,
    },
    modalOpcion: {
        paddingVertical: 12,
        fontSize: 16,
        color: colores.acento,
    },
    modalCancelar: {
        marginTop: 8,
        fontSize: 14,
        fontWeight: 'bold',
        color: colores.error,
    },
    filtros: {
        paddingHorizontal: 16,
        paddingTop: 16,
    },
});