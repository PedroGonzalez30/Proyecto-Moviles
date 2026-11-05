import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Home from './src/pages/Home';
import Rutinas from './src/pages/Rutinas';
import RutinaDetalle from './src/pages/RutinaDetalle';
import RegistroSesion from './src/pages/RegistroSesion';
import Historial from './src/pages/Historial';
import Perfil from './src/pages/Perfil';
import Registro from './src/pages/Registro';
import Login from './src/pages/Login';
import { RootStackParamList } from './src/types/navigation';
import Encabezado from './src/components/Encabezado';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{ header: () => <Encabezado />, }}>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Rutinas" component={Rutinas} />
          <Stack.Screen name="RutinaDetalle" component={RutinaDetalle} />
          <Stack.Screen name="RegistroSesion" component={RegistroSesion} />
          <Stack.Screen name="Historial" component={Historial} />
          <Stack.Screen name="Perfil" component={Perfil} />
          <Stack.Screen name="Registro" component={Registro} />
          <Stack.Screen name="Login" component={Login} />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}