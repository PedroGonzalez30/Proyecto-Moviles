import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { iniciarSesion } from '../storage/usuario';
import { RootStackParamList } from '../types/navigation';
import { colores } from '../components/temas';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function Login({ navigation }: Props) {
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');

    const handleEntrar = async () => {
        const ok = await iniciarSesion(correo.trim().toLowerCase(), contrasena);
        if (ok) {
            navigation.popToTop();
        } else {
            Alert.alert('Error', 'Correo o contraseña incorrectos.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.titulo}>Iniciar sesión</Text>

            <TextInput style={styles.input} placeholder="Correo" placeholderTextColor="#8FA9C4" value={correo} onChangeText={setCorreo} autoCapitalize="none" keyboardType="email-address" />
            <TextInput style={styles.input} placeholder="Contraseña" placeholderTextColor="#8FA9C4" value={contrasena} onChangeText={setContrasena} secureTextEntry />

            <TouchableOpacity style={styles.boton} onPress={handleEntrar}>
                <Text style={styles.botonTexto}>Entrar</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.replace('Registro')}>
                <Text style={styles.enlace}>¿No tienes cuenta? Regístrate</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
        backgroundColor: colores.fondo,
    },
    titulo: {
        marginBottom: 24,
        fontSize: 32,
        fontWeight: 'bold',
        color: colores.texto,
    },
    input: {
        marginBottom: 12,
        padding: 14,
        borderRadius: 12,
        backgroundColor: colores.tarjeta,
        fontSize: 16,
        color: colores.texto,
    },
    boton: {
        marginTop: 12,
        paddingVertical: 14,
        alignItems: 'center',
        borderRadius: 999,
        backgroundColor: colores.acento,
    },
    botonTexto: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colores.texto,
    },
    enlace: {
        marginTop: 20,
        textAlign: 'center',
        fontSize: 14,
        color: colores.acento,
    },
});