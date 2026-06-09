import { StyleSheet } from "react-native";
import { COLORS } from "../constants/colors";

export const globalStyles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: COLORS.light.background,
        paddingTop: 10,
        paddingBottom: 20,
    },
})