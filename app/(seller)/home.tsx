/** @format */

import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	ScrollView,
	StyleSheet,
	ViewStyle,
	TextStyle,
	TouchableOpacity,
	Image,
	ActivityIndicator,
	Modal,
} from "react-native";
import { theme } from "../theme";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Product {
	id: string;
	name: string;
	price: string;
	image: string;
	views: number;
	likes: number;
}

const ProductCard = ({
	product,
	onPress,
}: {
	product: Product;
	onPress: () => void;
}) => (
	<TouchableOpacity
		onPress={onPress}
		activeOpacity={0.8}
		style={styles.productCard as ViewStyle}>
		<Image
			source={{ uri: product.image }}
			style={styles.productImage}
			resizeMode='cover'
		/>
		<View style={styles.productInfo as ViewStyle}>
			<Text
				style={[styles.productName as TextStyle, { color: theme.colors.text }]}>
				{product.name}
			</Text>
			<Text
				style={[
					styles.productPrice as TextStyle,
					{ color: theme.colors.primary },
				]}>
				{product.price} ريال
			</Text>
			<View style={styles.statsContainer as ViewStyle}>
				<Text
					style={[styles.statsText as TextStyle, { color: theme.colors.text }]}>
					👁️ {product.views}
				</Text>
				<Text
					style={[styles.statsText as TextStyle, { color: theme.colors.text }]}>
					❤️ {product.likes}
				</Text>
			</View>
		</View>
	</TouchableOpacity>
);

export default function SellerHome() {
	const router = useRouter();
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);
	const [isNavigating, setIsNavigating] = useState(false);

	useEffect(() => {
		loadProducts();
	}, []);

	const loadProducts = async () => {
		try {
			const storedProducts = await AsyncStorage.getItem("sellerProducts");
			if (storedProducts) {
				setProducts(JSON.parse(storedProducts));
			}
		} catch (error) {
			console.error("Error loading products:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleProductPress = (productId: string) => {
		setIsNavigating(true);
		router.push(`/(seller)/product-details?id=${productId}`);
	};

	if (loading) {
		return (
			<View
				style={[
					styles.container as ViewStyle,
					{ backgroundColor: theme.colors.background },
				]}>
				<ActivityIndicator size='large' color={theme.colors.primary} />
			</View>
		);
	}

	return (
		<>
			<ScrollView
				style={[
					styles.container as ViewStyle,
					{ backgroundColor: theme.colors.background },
				]}>
				<View style={styles.header as ViewStyle}>
					<Text
						style={[styles.title as TextStyle, { color: theme.colors.text }]}>
						منتجاتي
					</Text>
					<TouchableOpacity
						style={[
							styles.addButton as ViewStyle,
							{ backgroundColor: theme.colors.primary },
						]}
						onPress={() => {
							setIsNavigating(true);
							router.push("/(seller)/add-product");
						}}>
						<Text
							style={[
								styles.addButtonText as TextStyle,
								{ color: theme.colors.white },
							]}>
							إضافة منتج
						</Text>
					</TouchableOpacity>
				</View>

				{products.length === 0 ? (
					<Text
						style={[
							styles.emptyText as TextStyle,
							{ color: theme.colors.text },
						]}>
						لا توجد منتجات متاحة حالياً
					</Text>
				) : (
					<View style={styles.productsGrid as ViewStyle}>
						{products.map((product) => (
							<ProductCard
								key={product.id}
								product={product}
								onPress={() => handleProductPress(product.id)}
							/>
						))}
					</View>
				)}
			</ScrollView>

			{/* Navigation Loading Overlay */}
			<Modal
				visible={isNavigating}
				transparent
				animationType='fade'
				onRequestClose={() => setIsNavigating(false)}>
				<View style={styles.loadingOverlay as ViewStyle}>
					<View style={styles.loadingContainer as ViewStyle}>
						<ActivityIndicator size='large' color={theme.colors.primary} />
						<Text
							style={[
								styles.loadingText as TextStyle,
								{ color: theme.colors.text },
							]}>
							جاري التحميل...
						</Text>
					</View>
				</View>
			</Modal>
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	header: {
		padding: theme.spacing.lg,
		shadowColor: theme.colors.text,
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	title: {
		fontSize: theme.typography.h1.fontSize,
		fontWeight: "700" as const,
		fontFamily: theme.typography.h1.fontFamily,
		textAlign: "right",
		marginBottom: theme.spacing.md,
	},
	addButton: {
		padding: theme.spacing.md,
		borderRadius: theme.borderRadius.md,
		alignItems: "center",
	},
	addButtonText: {
		fontSize: theme.typography.body.fontSize,
		fontWeight: "700" as const,
		fontFamily: theme.typography.body.fontFamily,
	},
	emptyText: {
		fontSize: theme.typography.body.fontSize,
		fontFamily: theme.typography.body.fontFamily,
		textAlign: "center",
		marginTop: theme.spacing.xl,
	},
	productsGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between",
		padding: theme.spacing.lg,
		gap: theme.spacing.md,
	},
	productCard: {
		width: "48%",
		backgroundColor: theme.colors.secondary,
		borderRadius: theme.borderRadius.md,
		overflow: "hidden",
		marginBottom: theme.spacing.md,
	},
	productImage: {
		width: "100%",
		height: 150,
	},
	productInfo: {
		padding: theme.spacing.md,
	},
	productName: {
		fontSize: theme.typography.body.fontSize,
		fontWeight: "700" as const,
		fontFamily: theme.typography.body.fontFamily,
		textAlign: "right",
		marginBottom: theme.spacing.xs,
	},
	productPrice: {
		fontSize: theme.typography.body.fontSize,
		fontWeight: "700" as const,
		fontFamily: theme.typography.body.fontFamily,
		textAlign: "right",
		marginBottom: theme.spacing.xs,
	},
	statsContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: theme.spacing.xs,
	},
	statsText: {
		fontSize: theme.typography.small.fontSize,
		fontFamily: theme.typography.small.fontFamily,
	},
	loadingOverlay: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		justifyContent: "center",
		alignItems: "center",
	},
	loadingContainer: {
		backgroundColor: theme.colors.background,
		padding: theme.spacing.xl,
		borderRadius: theme.borderRadius.lg,
		alignItems: "center",
		justifyContent: "center",
	},
	loadingText: {
		fontSize: theme.typography.body.fontSize,
		fontFamily: theme.typography.body.fontFamily,
		marginTop: theme.spacing.md,
	},
});
