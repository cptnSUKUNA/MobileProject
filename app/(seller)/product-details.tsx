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
} from "react-native";
import { theme } from "../theme";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

export default function ProductDetails() {
	const router = useRouter();
	const { id } = useLocalSearchParams();
	const [product, setProduct] = useState<Product | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		loadProduct();
	}, [id]);

	const loadProduct = async () => {
		try {
			const storedProducts = await AsyncStorage.getItem("sellerProducts");
			if (storedProducts) {
				const products = JSON.parse(storedProducts);
				const foundProduct = products.find((p: Product) => p.id === id);
				setProduct(foundProduct || null);
			}
		} catch (error) {
			console.error("Error loading product:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async () => {
		Alert.alert("تأكيد الحذف", "هل أنت متأكد من حذف هذا المنتج؟", [
			{
				text: "إلغاء",
				style: "cancel",
			},
			{
				text: "حذف",
				style: "destructive",
				onPress: async () => {
					try {
						const storedProducts = await AsyncStorage.getItem("sellerProducts");
						if (storedProducts) {
							const products = JSON.parse(storedProducts);
							const updatedProducts = products.filter(
								(p: Product) => p.id !== id
							);
							await AsyncStorage.setItem(
								"sellerProducts",
								JSON.stringify(updatedProducts)
							);
							router.back();
						}
					} catch (error) {
						console.error("Error deleting product:", error);
						Alert.alert("خطأ", "حدث خطأ أثناء حذف المنتج");
					}
				},
			},
		]);
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

	if (!product) {
		return (
			<View
				style={[
					styles.container as ViewStyle,
					{ backgroundColor: theme.colors.background },
				]}>
				<Text
					style={[styles.errorText as TextStyle, { color: theme.colors.text }]}>
					المنتج غير موجود
				</Text>
			</View>
		);
	}

	return (
		<View
			style={[
				styles.container as ViewStyle,
				{ backgroundColor: theme.colors.background },
			]}>
			<Image
				source={{ uri: product.image }}
				style={styles.image}
				resizeMode='cover'
			/>

			<View style={styles.content as ViewStyle}>
				<Text style={[styles.name as TextStyle, { color: theme.colors.text }]}>
					{product.name}
				</Text>

				<Text
					style={[styles.price as TextStyle, { color: theme.colors.primary }]}>
					{product.price} جنيه
				</Text>

				<View style={styles.ratingContainer as ViewStyle}>
					<Text
						style={[
							styles.rating as TextStyle,
							{ color: theme.colors.primary },
						]}>
						{product.rating} ⭐
					</Text>
					<Text
						style={[styles.reviews as TextStyle, { color: theme.colors.text }]}>
						({product.reviews} تقييم)
					</Text>
				</View>

				<Text
					style={[
						styles.description as TextStyle,
						{ color: theme.colors.text },
					]}>
					{product.description}
				</Text>

				<View style={styles.detailsContainer as ViewStyle}>
					<View style={styles.detailRow as ViewStyle}>
						<Text
							style={[
								styles.detailLabel as TextStyle,
								{ color: theme.colors.text },
							]}>
							المادة:
						</Text>
						<Text
							style={[
								styles.detailValue as TextStyle,
								{ color: theme.colors.text },
							]}>
							{product.material}
						</Text>
					</View>

					<View style={styles.detailRow as ViewStyle}>
						<Text
							style={[
								styles.detailLabel as TextStyle,
								{ color: theme.colors.text },
							]}>
							الأبعاد:
						</Text>
						<Text
							style={[
								styles.detailValue as TextStyle,
								{ color: theme.colors.text },
							]}>
							{product.dimensions}
						</Text>
					</View>

					<View style={styles.detailRow as ViewStyle}>
						<Text
							style={[
								styles.detailLabel as TextStyle,
								{ color: theme.colors.text },
							]}>
							الوزن:
						</Text>
						<Text
							style={[
								styles.detailValue as TextStyle,
								{ color: theme.colors.text },
							]}>
							{product.weight}
						</Text>
					</View>

					<View style={styles.detailRow as ViewStyle}>
						<Text
							style={[
								styles.detailLabel as TextStyle,
								{ color: theme.colors.text },
							]}>
							الشركة المصنعة:
						</Text>
						<Text
							style={[
								styles.detailValue as TextStyle,
								{ color: theme.colors.text },
							]}>
							{product.manufacturer}
						</Text>
					</View>

					<View style={styles.detailRow as ViewStyle}>
						<Text
							style={[
								styles.detailLabel as TextStyle,
								{ color: theme.colors.text },
							]}>
							المخزون:
						</Text>
						<Text
							style={[
								styles.detailValue as TextStyle,
								{ color: theme.colors.text },
							]}>
							{product.stock} قطعة
						</Text>
					</View>

					<View style={styles.detailRow as ViewStyle}>
						<Text
							style={[
								styles.detailLabel as TextStyle,
								{ color: theme.colors.text },
							]}>
							وقت الشحن:
						</Text>
						<Text
							style={[
								styles.detailValue as TextStyle,
								{ color: theme.colors.text },
							]}>
							{product.shippingTime}
						</Text>
					</View>

					<View style={styles.detailRow as ViewStyle}>
						<Text
							style={[
								styles.detailLabel as TextStyle,
								{ color: theme.colors.text },
							]}>
							تكلفة الشحن:
						</Text>
						<Text
							style={[
								styles.detailValue as TextStyle,
								{ color: theme.colors.text },
							]}>
							{product.shippingCost}
						</Text>
					</View>
				</View>

				<View style={styles.statsContainer as ViewStyle}>
					<View style={styles.statItem as ViewStyle}>
						<Text
							style={[
								styles.statValue as TextStyle,
								{ color: theme.colors.primary },
							]}>
							{product.views}
						</Text>
						<Text
							style={[
								styles.statLabel as TextStyle,
								{ color: theme.colors.text },
							]}>
							المشاهدات
						</Text>
					</View>

					<View style={styles.statItem as ViewStyle}>
						<Text
							style={[
								styles.statValue as TextStyle,
								{ color: theme.colors.primary },
							]}>
							{product.likes}
						</Text>
						<Text
							style={[
								styles.statLabel as TextStyle,
								{ color: theme.colors.text },
							]}>
							الإعجابات
						</Text>
					</View>
				</View>

				<TouchableOpacity
					style={[
						styles.deleteButton as ViewStyle,
						{ backgroundColor: "#FF3B30" },
					]}
					onPress={handleDelete}>
					<Text
						style={[
							styles.deleteButtonText as TextStyle,
							{ color: theme.colors.white },
						]}>
						حذف المنتج
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	image: {
		width: "100%",
		height: 300,
	},
	content: {
		padding: theme.spacing.lg,
		gap: theme.spacing.lg,
	},
	name: {
		fontSize: theme.typography.h2.fontSize,
		fontWeight: "700" as const,
		fontFamily: theme.typography.h2.fontFamily,
		textAlign: "right",
	},
	price: {
		fontSize: theme.typography.h2.fontSize,
		fontWeight: "700" as const,
		fontFamily: theme.typography.h2.fontFamily,
		textAlign: "right",
	},
	ratingContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginTop: theme.spacing.sm,
	},
	rating: {
		fontSize: theme.typography.body.fontSize,
		fontWeight: "700" as const,
		fontFamily: theme.typography.body.fontFamily,
		marginRight: theme.spacing.xs,
	},
	reviews: {
		fontSize: theme.typography.body.fontSize,
		fontFamily: theme.typography.body.fontFamily,
	},
	description: {
		fontSize: theme.typography.body.fontSize,
		fontFamily: theme.typography.body.fontFamily,
		textAlign: "right",
		marginTop: theme.spacing.lg,
		lineHeight: 24,
	},
	detailsContainer: {
		marginTop: theme.spacing.lg,
		gap: theme.spacing.sm,
	},
	detailRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	detailLabel: {
		fontSize: theme.typography.body.fontSize,
		fontFamily: theme.typography.body.fontFamily,
		fontWeight: "700" as const,
	},
	detailValue: {
		fontSize: theme.typography.body.fontSize,
		fontFamily: theme.typography.body.fontFamily,
	},
	statsContainer: {
		flexDirection: "row",
		justifyContent: "space-around",
		marginTop: theme.spacing.xl,
	},
	statItem: {
		alignItems: "center",
	},
	statValue: {
		fontSize: theme.typography.h2.fontSize,
		fontWeight: "700" as const,
		fontFamily: theme.typography.h2.fontFamily,
	},
	statLabel: {
		fontSize: theme.typography.body.fontSize,
		fontFamily: theme.typography.body.fontFamily,
		marginTop: theme.spacing.xs,
	},
	deleteButton: {
		padding: theme.spacing.md,
		borderRadius: theme.borderRadius.md,
		alignItems: "center",
		marginTop: theme.spacing.xl,
	},
	deleteButtonText: {
		fontSize: theme.typography.body.fontSize,
		fontWeight: "700" as const,
		fontFamily: theme.typography.body.fontFamily,
	},
	errorText: {
		fontSize: theme.typography.body.fontSize,
		fontFamily: theme.typography.body.fontFamily,
		textAlign: "center",
	},
});
