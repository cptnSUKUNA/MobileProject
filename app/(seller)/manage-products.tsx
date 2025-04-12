/** @format */

import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	Image,
	ScrollView,
	Alert,
} from "react-native";
import { theme } from "../theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

interface Product {
	id: string;
	name: string;
	price: string;
	image: string;
	description: string;
	material: string;
	dimensions: string;
	weight: string;
	manufacturer: string;
	stock: number;
	shippingTime: string;
	shippingCost: string;
}

export default function ManageProducts() {
	const [products, setProducts] = useState<Product[]>([]);
	const router = useRouter();

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
		}
	};

	const handleDeleteProduct = async (productId: string) => {
		Alert.alert("حذف المنتج", "هل أنت متأكد من حذف هذا المنتج؟", [
			{
				text: "إلغاء",
				style: "cancel",
			},
			{
				text: "حذف",
				style: "destructive",
				onPress: async () => {
					try {
						const updatedProducts = products.filter(
							(product) => product.id !== productId
						);
						await AsyncStorage.setItem(
							"sellerProducts",
							JSON.stringify(updatedProducts)
						);
						setProducts(updatedProducts);
						Alert.alert("نجاح", "تم حذف المنتج بنجاح");
					} catch (error) {
						console.error("Error deleting product:", error);
						Alert.alert("خطأ", "حدث خطأ أثناء حذف المنتج");
					}
				},
			},
		]);
	};

	return (
		<ScrollView style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.title}>إدارة المنتجات</Text>
				<TouchableOpacity
					style={styles.addButton}
					onPress={() => router.push("/(seller)/add-product")}>
					<Text style={styles.addButtonText}>إضافة منتج جديد</Text>
				</TouchableOpacity>
			</View>

			<View style={styles.productsList}>
				{products.map((product) => (
					<View key={product.id} style={styles.productCard}>
						<Image
							source={{ uri: product.image }}
							style={styles.productImage}
						/>
						<View style={styles.productInfo}>
							<Text style={styles.productName}>{product.name}</Text>
							<Text style={styles.productPrice}>{product.price} ريال</Text>
						</View>
						<TouchableOpacity
							style={styles.deleteButton}
							onPress={() => handleDeleteProduct(product.id)}>
							<Text style={styles.deleteButtonText}>حذف</Text>
						</TouchableOpacity>
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
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	title: {
		fontSize: theme.typography.h2.fontSize,
		fontFamily: theme.typography.h2.fontFamily,
		color: theme.colors.text,
	},
	addButton: {
		backgroundColor: theme.colors.primary,
		padding: theme.spacing.sm,
		borderRadius: theme.borderRadius.md,
	},
	addButtonText: {
		color: theme.colors.white,
		fontSize: theme.typography.body.fontSize,
		fontFamily: theme.typography.body.fontFamily,
	},
	productsList: {
		padding: theme.spacing.lg,
	},
	productCard: {
		flexDirection: "row",
		backgroundColor: theme.colors.white,
		borderRadius: theme.borderRadius.md,
		marginBottom: theme.spacing.md,
		padding: theme.spacing.md,
		alignItems: "center",
	},
	productImage: {
		width: 60,
		height: 60,
		borderRadius: theme.borderRadius.sm,
	},
	productInfo: {
		flex: 1,
		marginLeft: theme.spacing.md,
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
	deleteButton: {
		backgroundColor: "#FF3B30",
		padding: theme.spacing.sm,
		borderRadius: theme.borderRadius.md,
	},
	deleteButtonText: {
		color: theme.colors.white,
		fontSize: theme.typography.body.fontSize,
		fontFamily: theme.typography.body.fontFamily,
	},
});
