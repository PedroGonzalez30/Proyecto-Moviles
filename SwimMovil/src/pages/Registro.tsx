import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { registrarUsuario } from '../storage/usuario';
import { RootStackParamList } from '../types/navigation';
import { colores } from '../components/temas';

type Props = NativeStackScreenProps<RootStackParamList, 'Registro'>;

export default function Registro({ navigation }: Props) {
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');

    const handleRegistrar = async () => {
        if (!nombre.trim() || !correo.includes('@') || contrasena.length < 4) {
            Alert.alert('Datos incompletos', 'Revisa nombre, correo y una contraseña de mínimo 4 caracteres.');
            return;
        }
        try {
            await registrarUsuario({
                id: Date.now().toString(),
                nombre: nombre.trim(),
                correo: correo.trim().toLowerCase(),
                contrasena,
            });
            navigation.popToTop();
        } catch {
            Alert.alert('Error', 'No se pudo crear la cuenta.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.titulo}>Crear cuenta</Text>

            <TextInput style={styles.input} placeholder="Nombre" placeholderTextColor="#8FA9C4" value={nombre} onChangeText={setNombre} />
            <TextInput style={styles.input} placeholder="Correo" placeholderTextColor="#8FA9C4" value={correo} onChangeText={setCorreo} autoCapitalize="none" keyboardType="email-address" />
            <TextInput style={styles.input} placeholder="Contraseña" placeholderTextColor="#8FA9C4" value={contrasena} onChangeText={setContrasena} secureTextEntry />

            <TouchableOpacity style={styles.boton} onPress={handleRegistrar}>
                <Text style={styles.botonTexto}>Registrarme</Text>
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
});