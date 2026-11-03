import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { haySesionActiva } from '../storage/usuario';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function Home({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [logueado, setLogueado] = useState(false);

  useFocusEffect(
    useCallback(() => {
      haySesionActiva().then(setLogueado);
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      {logueado ? (
        <TouchableOpacity
          style={[styles.botonPerfil, { top: insets.top + 8 }]}
          onPress={() => navigation.navigate('Perfil')}
        >
          <Text style={styles.botonPerfilIcono}>👤</Text>
        </TouchableOpacity>
      ) : (
        <View style={[styles.barraCuenta, { top: insets.top + 8 }]}>
          <TouchableOpacity style={styles.botonCuenta} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.botonCuentaTexto}>Iniciar sesión</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.botonCuenta} onPress={() => navigation.navigate('Registro')}>
            <Text style={styles.botonCuentaTexto}>Registrarse</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.titulo}>SwimApp</Text>
      <Text style={styles.subtitulo}>Entrena tu natación</Text>

      <TouchableOpacity style={styles.boton} onPress={() => navigation.navigate('Rutinas')}>
        <Text style={styles.botonTexto}>Ver rutinas</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.botonSecundario} onPress={() => navigation.navigate('RegistroSesion')}>
        <Text style={styles.botonSecundarioTexto}>Registrar sesión</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.botonSecundario} onPress={() => navigation.navigate('Historial')}>
        <Text style={styles.botonSecundarioTexto}>Ver historial</Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#0A2540',
  },
  botonPerfil: {
    position: 'absolute',
    right: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#123A63',
  },
  botonPerfilIcono: {
    fontSize: 22,
  },
  barraCuenta: {
    position: 'absolute',
    right: 16,
    flexDirection: 'row',
  },
  botonCuenta: {
    marginLeft: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#7FDBFF',
  },
  botonCuentaTexto: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#7FDBFF',
  },
  titulo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subtitulo: {
    marginTop: 8,
    fontSize: 18,
    color: '#7FDBFF',
  },
  boton: {
    marginTop: 32,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 999,
    backgroundColor: '#7FDBFF',
  },
  botonTexto: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0A2540',
  },
  botonSecundario: {
    marginTop: 16,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#7FDBFF',
  },
  botonSecundarioTexto: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7FDBFF',
  },
});