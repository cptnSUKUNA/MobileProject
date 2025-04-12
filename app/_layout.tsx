/** @format */

import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import { theme } from "./theme";
import { I18nManager } from "react-native";
import { useEffect } from "react";

// Force RTL layout
I18nManager.forceRTL(true);
I18nManager.allowRTL(true);

export default function Layout() {
	const colorScheme = useColorScheme();

	useEffect(() => {
		// Ensure RTL is enabled
		I18nManager.forceRTL(true);
		I18nManager.allowRTL(true);
	}, []);

	return (
		<Stack
			screenOptions={{
				headerStyle: {
					backgroundColor: theme.colors.background,
				},
				headerTintColor: theme.colors.text,
				headerTitleStyle: {
					fontFamily: theme.typography.h1.fontFamily,
					fontWeight: theme.typography.h1.fontWeight,
				},
				headerBackTitle: "رجوع",
				headerBackTitleStyle: {
					fontFamily: theme.typography.body.fontFamily,
				},
			}}>
			<Stack.Screen
				name='index'
				options={{
					title: "تطبيق الحرف اليدوية",
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name='role-selection'
				options={{
					title: "اختر دورك",
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name='(buyer)/home'
				options={{
					title: "الرئيسية",
				}}
			/>
			<Stack.Screen
				name='(buyer)/product-details'
				options={{
					title: "تفاصيل المنتج",
				}}
			/>
			<Stack.Screen
				name='(seller)/home'
				options={{
					title: "الرئيسية",
				}}
			/>
			<Stack.Screen
				name='(seller)/add-product'
				options={{
					title: "إضافة منتج",
				}}
			/>
			<Stack.Screen
				name='(seller)/product-details'
				options={{
					title: "تفاصيل المنتج",
				}}
			/>
		</Stack>
	);
}
