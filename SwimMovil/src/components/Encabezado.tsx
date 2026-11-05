import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { haySesionActiva } from '../storage/usuario';
import { colores, Esquinas } from './temas';
import { RootStackParamList } from '../types/navigation';

export default function Encabezado() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const insets = useSafeAreaInsets();
    const [logueado, setLogueado] = useState(false);

    useFocusEffect(
        useCallback(() => {
            haySesionActiva().then(setLogueado);
        }, [])
    );

    return (
        <View style={[styles.barra, { paddingTop: insets.top + 8 }]}>
            <View style={styles.izquierda}>
                {navigation.canGoBack() && (
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Text style={styles.atras}>←</Text>
                    </TouchableOpacity>
                )}
                <Text style={styles.titulo}>SwimApp</Text>
            </View>

            {logueado ? (
                <TouchableOpacity style={styles.chip} onPress={() => navigation.navigate('Perfil')}>
                    <Text style={styles.chipTexto}>Perfil</Text>
                </TouchableOpacity>
            ) : (
                <View style={styles.derecha}>
                    <TouchableOpacity style={styles.chip} onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.chipTexto}>Iniciar sesión</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.chipLleno} onPress={() => navigation.navigate('Registro')}>
                        <Text style={styles.chipLlenoTexto}>Registrarse</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    barra: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 12,
        backgroundColor: colores.primario,
    },
    izquierda: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    derecha: {
        flexDirection: 'row',
    },
    atras: {
        marginRight: 12,
        fontSize: 22,
        color: colores.tarjeta,
    },
    titulo: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colores.tarjeta,
    },
    chip: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: Esquinas.pildora,
        borderWidth: 1,
        borderColor: colores.tarjeta,
    },
    chipTexto: {
        fontSize: 13,
        fontWeight: 'bold',
        color: colores.tarjeta,
    },
    chipLleno: {
        marginLeft: 8,
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: Esquinas.pildora,
        backgroundColor: colores.tarjeta,
    },
    chipLlenoTexto: {
        fontSize: 13,
        fontWeight: 'bold',
        color: colores.primario,
    },
});