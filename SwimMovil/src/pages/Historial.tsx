import { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { borrarSesion, obtenerSesiones } from '../storage/sesiones';
import { Sesion } from '../types';

export default function Historial() {
    const [sesiones, setSesiones] = useState<Sesion[]>([]);

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

    const renderSesion = ({ item }: { item: Sesion }) => (
        <View style={styles.card}>
            <View style={styles.cardInfo}>
                <Text style={styles.fecha}>{new Date(item.fecha).toLocaleDateString()}</Text>
                <Text style={styles.detalle}>
                    {item.duracionMin} min · {item.series.length} ejercicios
                </Text>
            </View>
            <TouchableOpacity onPress={() => confirmarBorrado(item.id)}>
                <Text style={styles.borrarTexto}>Borrar</Text>
            </TouchableOpacity>
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: 16,
        marginBottom: 12,
        padding: 16,
        borderRadius: 12,
        backgroundColor: '#123A63',
    },
    cardInfo: {
        flex: 1,
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
    borrarTexto: {
        marginLeft: 12,
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FF6B6B',
    },
    vacio: {
        marginTop: 40,
        textAlign: 'center',
        fontSize: 16,
        color: '#FFFFFF',
    },
});