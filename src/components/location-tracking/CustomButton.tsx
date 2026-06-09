import { Dimensions, Pressable, StyleSheet, Text } from 'react-native'
import React from 'react'
import { useTheme } from '../../hooks/useThemeMode'
import { ColorTheme } from '../../constants/colors';

type CustomButtonProps = {
    title: string;
    onPress: () => void;
}

const { width } = Dimensions.get('window');
const CustomButton = ({ title, onPress }: CustomButtonProps) => {
    const theme = useTheme();
    const styles = createStyles(theme);
    return (
        <Pressable onPress={onPress} style={styles.button}>
            <Text style={styles.buttonText}>{title}</Text>
        </Pressable>
    )
}

export default CustomButton

const createStyles = (theme: ColorTheme) => StyleSheet.create({
    button: {
        justifyContent: "center",
        alignItems: "center",
        shadowColor: theme.shadowColor,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginVertical: 10,
        height: 60,
        width: width * 0.8,
        borderRadius: 9999,
        backgroundColor: theme.primary,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "bold",
        color: theme.text,
    },
})