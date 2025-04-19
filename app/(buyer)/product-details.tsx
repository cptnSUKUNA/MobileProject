/** @format */

import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	ViewStyle,
	TextStyle,
	Image,
	ActivityIndicator,
	TouchableOpacity,
	Alert,
	ScrollView,
} from "react-native";
import { theme } from "../theme";
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { staticProducts } from "./home";

interface Product {
	id: string;
	name: string;
	price: string;
	image: string;
	views: number;
	likes: number;
	description: string;
	material: string;
	dimensions: string;
	weight: string;
	manufacturer: string;
	rating: number;
	reviews: number;
	stock: number;
	shippingTime: string;
	shippingCost: string;
}

interface CartItem extends Product {
	quantity: number;
}

export default function BuyerProductDetails() {
	const { id } = useLocalSearchParams();
	console.log(id)
	const [product, setProduct] = useState<Product | null>(null);
	const [isFavorite, setIsFavorite] = useState(false);
	const [isInCart, setIsInCart] = useState(false);

	useEffect(() => {
		loadProduct();
		checkFavoriteStatus();
		checkCartStatus();
	}, [id]);

	const loadProduct = async () => {
		const products = JSON.parse(localStorage.getItem("sellerProducts") || "[]") as Product[];
		console.log(products)
		const foundProduct = products.find((p: Product) => p.id === id);
		console.log(foundProduct)
		if (foundProduct) {

			setProduct(foundProduct);
		
		} else {
			Alert.alert("خطأ", "المنتج غير موجود");
		}
	};

	const checkFavoriteStatus = async () => {
		try {
			const storedFavorites = await AsyncStorage.getItem("favorites");
			if (storedFavorites) {
				const favorites = JSON.parse(storedFavorites);
				setIsFavorite(favorites.some((p: Product) => p.id === id));
			}
		} catch (error) {
			console.error("Error checking favorite status:", error);
		}
	};

	const checkCartStatus = async () => {
		try {
			const storedCart = await AsyncStorage.getItem("cart");
			if (storedCart) {
				const cart = JSON.parse(storedCart);
				setIsInCart(cart.some((p: Product) => p.id === id));
			}
		} catch (error) {
			console.error("Error checking cart status:", error);
		}
	};

	const handleToggleFavorite = async () => {
		try {
			const storedFavorites = await AsyncStorage.getItem("favorites");
			let favorites = storedFavorites ? JSON.parse(storedFavorites) : [];

			if (isFavorite) {
				favorites = favorites.filter((p: Product) => p.id !== id);
			} else if (product) {
				favorites.push(product);
			}

			await AsyncStorage.setItem("favorites", JSON.stringify(favorites));
			setIsFavorite(!isFavorite);
		} catch (error) {
			console.error("Error toggling favorite:", error);
			Alert.alert("خطأ", "حدث خطأ أثناء تحديث المفضلة");
		}
	};

	const handleAddToCart = async () => {
		try {
			const storedCart = await AsyncStorage.getItem("cart");
			let cart = storedCart ? JSON.parse(storedCart) : [];

			if (!isInCart && product) {
				cart.push(product);
				await AsyncStorage.setItem("cart", JSON.stringify(cart));
				setIsInCart(true);
				Alert.alert("نجاح", "تمت إضافة المنتج إلى السلة");
			}
		} catch (error) {
			console.error("Error adding to cart:", error);
			Alert.alert("خطأ", "حدث خطأ أثناء إضافة المنتج إلى السلة");
		}
	};



	if (!product) {
		return (
			<View style={styles.container}>
				<Text>المنتج غير موجود</Text>
			</View>
		);
	}

	return (
		<ScrollView style={styles.container}>
			<Image source={{ uri: product.image }} style={styles.image} />
			<View style={styles.content}>
				<View style={styles.header}>
					<Text style={styles.name}>{product.name}</Text>
					<TouchableOpacity onPress={handleToggleFavorite}>
						<Text style={styles.favoriteButton}>
							{isFavorite ? "❤️" : "🤍"}
						</Text>
					</TouchableOpacity>
				</View>
				<Text style={styles.price}>{product.price} جنيه</Text>
				<Text style={styles.description}>{product.description}</Text>
				<View style={styles.details}>
					<Text style={styles.detail}>المادة: {product.material}</Text>
					<Text style={styles.detail}>الأبعاد: {product.dimensions}</Text>
					<Text style={styles.detail}>الوزن: {product.weight}</Text>
					<Text style={styles.detail}>
						الشركة المصنعة: {product.manufacturer}
					</Text>
					<Text style={styles.detail}>المخزون: {product.stock} قطعة</Text>
					<Text style={styles.detail}>وقت الشحن: {product.shippingTime}</Text>
					<Text style={styles.detail}>تكلفة الشحن: {product.shippingCost}</Text>
				</View>
				<TouchableOpacity
					style={[
						styles.addToCartButton,
						isInCart && styles.addToCartButtonDisabled,
					]}
					onPress={handleAddToCart}
					disabled={isInCart}>
					<Text style={styles.addToCartButtonText}>
						{isInCart ? "في السلة" : "أضف إلى السلة"}
					</Text>
				</TouchableOpacity>
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: theme.colors.background,
	},
	image: {
		width: "100%",
		height: 300,
	},
	content: {
		padding: theme.spacing.lg,
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: theme.spacing.sm,
	},
	name: {
		fontSize: theme.typography.h2.fontSize,
		fontFamily: theme.typography.h2.fontFamily,
		color: theme.colors.text,
	},
	favoriteButton: {
		fontSize: 24,
	},
	price: {
		fontSize: theme.typography.h2.fontSize,
		fontFamily: theme.typography.h2.fontFamily,
		color: theme.colors.primary,
		marginBottom: theme.spacing.md,
	},
	description: {
		fontSize: theme.typography.body.fontSize,
		fontFamily: theme.typography.body.fontFamily,
		color: theme.colors.text,
		marginBottom: theme.spacing.lg,
	},
	details: {
		marginBottom: theme.spacing.lg,
	},
	detail: {
		fontSize: theme.typography.body.fontSize,
		fontFamily: theme.typography.body.fontFamily,
		color: theme.colors.text,
		marginBottom: theme.spacing.sm,
	},
	addToCartButton: {
		backgroundColor: theme.colors.primary,
		padding: theme.spacing.md,
		borderRadius: theme.borderRadius.md,
		alignItems: "center",
	},
	addToCartButtonDisabled: {
		backgroundColor: theme.colors.gray,
	},
	addToCartButtonText: {
		color: theme.colors.white,
		fontSize: theme.typography.body.fontSize,
		fontFamily: theme.typography.body.fontFamily,
	},
});
