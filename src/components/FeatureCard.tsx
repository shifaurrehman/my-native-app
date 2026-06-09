import { StyleSheet, Text, Pressable, Dimensions } from 'react-native'
import React from 'react'
import { useTheme } from '../hooks/useThemeMode';
import { ColorTheme } from '../constants/colors';

type FeatureCardProps = {
    title: string;
    onPress: () => void;
}

const { width, height } = Dimensions.get('window');
const FeatureCard = ({ title, onPress }: FeatureCardProps) => {
    const theme = useTheme();
    const styles = createStyles(theme);
    return (
        <Pressable onPress={onPress} style={styles.card}>
            <Text style={styles.title}>{title}</Text>
        </Pressable>
    )
}

export default FeatureCard

const createStyles = (theme: ColorTheme) => StyleSheet.create({
    card: {
        width: width * 0.9,
        height: height * 0.3,
        backgroundColor: theme.surface,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        shadowColor: theme.shadowColor,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginVertical: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: theme.text,
    },
})