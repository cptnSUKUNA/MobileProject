/** @format */

import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	Image,
	ScrollView,
} from "react-native";
import { theme } from "../theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

interface Product {
	id: string;
	name: string;
	price: string;
	image: string;
}

export default function Favorites() {
	const [favorites, setFavorites] = useState<Product[]>([]);
	const [cart, setCart] = useState<Product[]>([]);
	const router = useRouter();

	useEffect(() => {
		loadFavorites();
		loadCart();
	}, []);

	const loadFavorites = async () => {
		try {
			const storedFavorites = await AsyncStorage.getItem("favorites");
			if (storedFavorites) {
				setFavorites(JSON.parse(storedFavorites));
			}
		} catch (error) {
			console.error("Error loading favorites:", error);
		}
	};

	const loadCart = async () => {
		try {
			const storedCart = await AsyncStorage.getItem("cart");
			if (storedCart) {
				setCart(JSON.parse(storedCart));
			}
		} catch (error) {
			console.error("Error loading cart:", error);
		}
	};

	const handleRemoveFromFavorites = async (productId: string) => {
		try {
			const updatedFavorites = favorites.filter(
				(product) => product.id !== productId
			);
			await AsyncStorage.setItem("favorites", JSON.stringify(updatedFavorites));
			setFavorites(updatedFavorites);
		} catch (error) {
			console.error("Error removing from favorites:", error);
		}
	};

	const handleAddToCart = async (product: Product) => {
		try {
			const updatedCart = [...cart, product];
			await AsyncStorage.setItem("cart", JSON.stringify(updatedCart));
			setCart(updatedCart);
		} catch (error) {
			console.error("Error adding to cart:", error);
		}
	};

	return (
		<ScrollView style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.title}>المفضلة</Text>
			</View>

			<View style={styles.productsList}>
				{favorites.map((product) => (
					<View key={product.id} style={styles.productCard}>
						<Image
							source={{ uri: product.image }}
							style={styles.productImage}
						/>
						<View style={styles.productInfo}>
							<Text style={styles.productName}>{product.name}</Text>
							<Text style={styles.productPrice}>{product.price} ريال</Text>
						</View>
						<View style={styles.actions}>
							<TouchableOpacity
								style={styles.removeButton}
								onPress={() => handleRemoveFromFavorites(product.id)}>
								<Text style={styles.removeButtonText}>إزالة</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.cartButton}
								onPress={() => handleAddToCart(product)}>
								<Text style={styles.cartButtonText}>إضافة للسلة</Text>
							</TouchableOpacity>
						</View>
					</View>
				))}
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: theme.colors.background,
	},
	header: {
		padding: theme.spacing.lg,
	},
	title: {
		fontSize: theme.typography.h2.fontSize,
		fontFamily: theme.typography.h2.fontFamily,
		color: theme.colors.text,
	},
	productsList: {
		padding: theme.spacing.lg,
	},
	productCard: {
		backgroundColor: theme.colors.white,
		borderRadius: theme.borderRadius.md,
		marginBottom: theme.spacing.md,
		padding: theme.spacing.md,
	},
	productImage: {
		width: "100%",
		height: 200,
		borderRadius: theme.borderRadius.md,
		marginBottom: theme.spacing.md,
	},
	productInfo: {
		marginBottom: theme.spacing.md,
	},
	productName: {
		fontSize: theme.typography.body.fontSize,
		fontFamily: theme.typography.body.fontFamily,
		color: theme.colors.text,
	},
	productPrice: {
		fontSize: theme.typography.body.fontSize,
		fontFamily: theme.typography.body.fontFamily,
		color: theme.colors.primary,
	},
	actions: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	removeButton: {
		backgroundColor: "#FF3B30",
		padding: theme.spacing.sm,
		borderRadius: theme.borderRadius.md,
	},
	removeButtonText: {
		color: theme.colors.white,
		fontSize: theme.typography.body.fontSize,
		fontFamily: theme.typography.body.fontFamily,
	},
	cartButton: {
		backgroundColor: theme.colors.primary,
		padding: theme.spacing.sm,
		borderRadius: theme.borderRadius.md,
	},
	cartButtonText: {
		color: theme.colors.white,
		fontSize: theme.typography.body.fontSize,
		fontFamily: theme.typography.body.fontFamily,
	},
});
