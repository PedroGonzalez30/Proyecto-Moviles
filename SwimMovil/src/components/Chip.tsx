import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Esquinas, colores } from './temas';

type Props<T extends string> = {
    opciones: T[];
    seleccionados: T[];
    onToggle: (opcion: T) => void;
};

export default function Chip<T extends string>({ opciones, seleccionados, onToggle }: Props<T>) {
    return (
        <View style={styles.fila}>
            {opciones.map((o) => {
                const activo = seleccionados.includes(o);
                return (
                    <TouchableOpacity
                        key={o}
                        style={[styles.chip, activo && styles.chipActivo]}
                        onPress={() => onToggle(o)}
                    >
                        <Text style={[styles.texto, activo && styles.textoActivo]}>{o}</Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    fila: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    chip: {
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderWidth: 1,
        borderColor: colores.borde,
        borderRadius: Esquinas.pildora,
        backgroundColor: colores.tarjeta,
    },
    chipActivo: {
        borderColor: colores.acento,
        backgroundColor: colores.acento,
    },
    texto: {
        fontSize: 14,
        color: colores.texto,
    },
    textoActivo: {
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
});