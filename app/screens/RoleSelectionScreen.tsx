/** @format */

import React from "react";
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	ViewStyle,
	TextStyle,
} from "react-native";
import { theme } from "../theme";
import { useRouter } from "expo-router";

export default function RoleSelectionScreen() {
	const router = useRouter();

	const RoleCard = ({
		title,
		onPress,
	}: {
		title: string;
		onPress: () => void;
	}) => (
		<TouchableOpacity
			style={[
				styles.card as ViewStyle,
				{ backgroundColor: theme.colors.secondary },
			]}
			onPress={onPress}
			activeOpacity={0.8}>
			<Text
				style={[styles.cardText as TextStyle, { color: theme.colors.primary }]}>
				{title}
			</Text>
		</TouchableOpacity>
	);

	return (
		<View
			style={[
				styles.container as ViewStyle,
				{ backgroundColor: theme.colors.background },
			]}>
			<Text style={[styles.title as TextStyle, { color: theme.colors.text }]}>
				مرحباً بك في سوق الحرف اليدوية
			</Text>
			<Text
				style={[styles.subtitle as TextStyle, { color: theme.colors.text }]}>
				اختر دورك للبدء
			</Text>

			<View style={styles.cardsContainer as ViewStyle}>
				<RoleCard title='مشتري' onPress={() => router.push("/(buyer)/home")} />
				<RoleCard title='بائع' onPress={() => router.push("/(seller)/home")} />
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: theme.spacing.lg,
		alignItems: "center",
		justifyContent: "center",
	},
	title: {
		fontSize: theme.typography.h1.fontSize,
		fontWeight: "700" as const,
		fontFamily: theme.typography.h1.fontFamily,
		textAlign: "center",
		marginBottom: theme.spacing.sm,
	},
	subtitle: {
		fontSize: theme.typography.body.fontSize,
		fontWeight: "400" as const,
		fontFamily: theme.typography.body.fontFamily,
		textAlign: "center",
		marginBottom: theme.spacing.xl,
	},
	cardsContainer: {
		width: "100%",
		gap: theme.spacing.lg,
	},
	card: {
		borderRadius: theme.borderRadius.lg,
		padding: theme.spacing.xl,
		alignItems: "center",
		justifyContent: "center",
		shadowColor: theme.colors.text,
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
		height: 150,
	},
	cardText: {
		fontSize: theme.typography.h2.fontSize,
		fontWeight: "700" as const,
		fontFamily: theme.typography.h2.fontFamily,
	},
});
