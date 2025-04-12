/** @format */

import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	ViewStyle,
	TextStyle,
	TouchableOpacity,
	Image,
	ActivityIndicator,
	ScrollView,
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
	category: string;
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

interface Category {
	id: string;
	name: string;
	image: string;
}

const ProductCard = ({
	product,
	onPress,
}: {
	product: Product;
	onPress: () => void;
}) => (
	<TouchableOpacity style={styles.productCard as ViewStyle} onPress={onPress}>
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
				{product.price} جنيه
			</Text>
		</View>
	</TouchableOpacity>
);

const CategoryCard = ({
	category,
	onPress,
	isSelected,
}: {
	category: Category;
	onPress: () => void;
	isSelected: boolean;
}) => (
	<TouchableOpacity
		style={[
			styles.categoryCard as ViewStyle,
			isSelected && {
				borderColor: theme.colors.primary,
				borderWidth: 2,
				transform: [{ scale: 1.05 }],
			},
		]}
		onPress={onPress}>
		<Image
			source={{ uri: category.image }}
			style={styles.categoryImage}
			resizeMode='cover'
		/>
		<View
			style={[
				styles.categoryOverlay as ViewStyle,
				isSelected && { backgroundColor: "rgba(0, 0, 0, 0.6)" },
			]}>
			<Text
				style={[
					styles.categoryName as TextStyle,
					{ color: theme.colors.white },
					isSelected && { color: theme.colors.primary },
				]}>
				{category.name}
			</Text>
		</View>
	</TouchableOpacity>
);

// Sample categories data with better images
const categories: Category[] = [
	{
		id: "1",
		name: "الخزف",
		image: "https://i.postimg.cc/9f20fMNq/main.jpg",
	},
	{
		id: "2",
		name: "النسيج",
		image: "https://i.postimg.cc/9f20fMNq/main.jpg",
	},
	{
		id: "3",
		name: "الخشب",
		image: "https://i.postimg.cc/9f20fMNq/main.jpg",
	},
	{
		id: "4",
		name: "المعادن",
		image: "https://i.postimg.cc/9f20fMNq/main.jpg",
	},
];

// Static most selling products
const staticMostSellingProducts: Product[] = [
	{
		id: "1",
		name: "سجادة يدوية",
		price: "250",
		image: "https://i.postimg.cc/9f20fMNq/main.jpg",
		views: 1000,
		likes: 500,
		category: "النسيج",
		description: "سجادة يدوية جميلة",
		material: "أقمشة",
		dimensions: "200x300 سم",
		weight: "5 كجم",
		manufacturer: "مصنع السجادات",
		rating: 4.5,
		reviews: 120,
		stock: 10,
		shippingTime: "3 أيام",
		shippingCost: "50 جنيه",
	},
	{
		id: "2",
		name: "مزهرية خزفية",
		price: "180",
		image: "https://i.postimg.cc/9f20fMNq/main.jpg",
		views: 800,
		likes: 400,
		category: "الخزف",
		description: "مزهرية خزفية جميلة",
		material: "خزف",
		dimensions: "10 سم",
		weight: "0.5 كجم",
		manufacturer: "مصنع الخزف",
		rating: 4.2,
		reviews: 80,
		stock: 5,
		shippingTime: "2 أيام",
		shippingCost: "30 جنيه",
	},
	{
		id: "3",
		name: "طاولة خشبية",
		price: "350",
		image: "https://i.postimg.cc/9f20fMNq/main.jpg",
		views: 600,
		likes: 300,
		category: "الخشب",
		description: "طاولة خشبية جميلة",
		material: "خشب",
		dimensions: "150x80 سم",
		weight: "10 كجم",
		manufacturer: "مصنع الطاولات",
		rating: 4.8,
		reviews: 100,
		stock: 8,
		shippingTime: "4 أيام",
		shippingCost: "70 جنيه",
	},
	{
		id: "4",
		name: "شمعدان نحاسي",
		price: "120",
		image: "https://i.postimg.cc/9f20fMNq/main.jpg",
		views: 400,
		likes: 200,
		category: "المعادن",
		description: "شمعدان نحاسي جميل",
		material: "نحاس",
		dimensions: "5 سم",
		weight: "0.2 كجم",
		manufacturer: "مصنع المعادن",
		rating: 4.0,
		reviews: 50,
		stock: 3,
		shippingTime: "2 أيام",
		shippingCost: "20 جنيه",
	},
];

// Static products for each category
const staticProducts: Product[] = [
	// Pottery products (الخزف)
	{
		id: "p1",
		name: "مجموعة أواني خزفية",
		price: "320",
		image: "https://i.postimg.cc/9f20fMNq/main.jpg",
		views: 300,
		likes: 150,
		category: "الخزف",
		description: "مجموعة أواني خزفية جميلة",
		material: "خزف",
		dimensions: "20 سم",
		weight: "5 كجم",
		manufacturer: "مصنع الخزف",
		rating: 4.7,
		reviews: 100,
		stock: 10,
		shippingTime: "3 أيام",
		shippingCost: "50 جنيه",
	},
	{
		id: "p2",
		name: "صحن خزفي مزخرف",
		price: "95",
		image: "https://i.postimg.cc/9f20fMNq/main.jpg",
		views: 250,
		likes: 120,
		category: "الخزف",
		description: "صحن خزفي مزخرف جميل",
		material: "خزف",
		dimensions: "15 سم",
		weight: "0.5 كجم",
		manufacturer: "مصنع الخزف",
		rating: 4.5,
		reviews: 60,
		stock: 5,
		shippingTime: "2 أيام",
		shippingCost: "20 جنيه",
	},
	{
		id: "p3",
		name: "إبريق شاي تقليدي",
		price: "180",
		image: "https://i.postimg.cc/9f20fMNq/main.jpg",
		views: 400,
		likes: 200,
		category: "الخزف",
		description: "إبريق شاي تقليدي جميل",
		material: "خزف",
		dimensions: "10 سم",
		weight: "0.3 كجم",
		manufacturer: "مصنع الخزف",
		rating: 4.8,
		reviews: 80,
		stock: 10,
		shippingTime: "3 أيام",
		shippingCost: "30 جنيه",
	},

	// Textile products (النسيج)
	{
		id: "t1",
		name: "وسادة مطرزة",
		price: "85",
		image: "https://i.postimg.cc/9f20fMNq/main.jpg",
		views: 350,
		likes: 180,
		category: "النسيج",
		description: "وسادة مطرزة جميلة",
		material: "أقمشة",
		dimensions: "150 سم",
		weight: "0.5 كجم",
		manufacturer: "مصنع النسيج",
		rating: 4.3,
		reviews: 70,
		stock: 8,
		shippingTime: "2 أيام",
		shippingCost: "20 جنيه",
	},
	{
		id: "t2",
		name: "غطاء طاولة منسوج",
		price: "150",
		image: "https://i.postimg.cc/9f20fMNq/main.jpg",
		views: 280,
		likes: 140,
		category: "النسيج",
		description: "غطاء طاولة منسوج جميل",
		material: "نسيج",
		dimensions: "150 سم",
		weight: "0.3 كجم",
		manufacturer: "مصنع النسيج",
		rating: 4.6,
		reviews: 50,
		stock: 6,
		shippingTime: "2 أيام",
		shippingCost: "15 جنيه",
	},
	{
		id: "t3",
		name: "حقيبة يدوية",
		price: "120",
		image: "https://i.postimg.cc/9f20fMNq/main.jpg",
		views: 420,
		likes: 210,
		category: "النسيج",
		description: "حقيبة يدوية جميلة",
		material: "أقمشة",
		dimensions: "30 سم",
		weight: "0.2 كجم",
		manufacturer: "مصنع النسيج",
		rating: 4.2,
		reviews: 40,
		stock: 5,
		shippingTime: "2 أيام",
		shippingCost: "10 جنيه",
	},

	// Wood products (الخشب)
	{
		id: "w1",
		name: "صندوق خشبي منقوش",
		price: "220",
		image: "https://i.postimg.cc/9f20fMNq/main.jpg",
		views: 380,
		likes: 190,
		category: "الخشب",
		description: "صندوق خشبي منقوش جميل",
		material: "خشب",
		dimensions: "30 سم",
		weight: "1 كجم",
		manufacturer: "مصنع الخشب",
		rating: 4.7,
		reviews: 90,
		stock: 8,
		shippingTime: "3 أيام",
		shippingCost: "30 جنيه",
	},
	{
		id: "w2",
		name: "رف كتب خشبي",
		price: "280",
		image: "https://i.postimg.cc/9f20fMNq/main.jpg",
		views: 320,
		likes: 160,
		category: "الخشب",
		description: "رف كتب خشبي جميل",
		material: "خشب",
		dimensions: "100 سم",
		weight: "0.5 كجم",
		manufacturer: "مصنع الخشب",
		rating: 4.5,
		reviews: 70,
		stock: 6,
		shippingTime: "2 أيام",
		shippingCost: "20 جنيه",
	},
	{
		id: "w3",
		name: "مقعد خشبي مزخرف",
		price: "190",
		image: "https://i.postimg.cc/9f20fMNq/main.jpg",
		views: 450,
		likes: 225,
		category: "الخشب",
		description: "مقعد خشبي مزخرف جميل",
		material: "خشب",
		dimensions: "50 سم",
		weight: "0.3 كجم",
		manufacturer: "مصنع الخشب",
		rating: 4.8,
		reviews: 100,
		stock: 10,
		shippingTime: "3 أيام",
		shippingCost: "25 جنيه",
	},

	// Metal products (المعادن)
	{
		id: "m1",
		name: "ساعة حائط نحاسية",
		price: "240",
		image: "https://i.postimg.cc/9f20fMNq/main.jpg",
		views: 290,
		likes: 145,
		category: "المعادن",
		description: "ساعة حائط نحاسية جميلة",
		material: "نحاس",
		dimensions: "10 سم",
		weight: "0.2 كجم",
		manufacturer: "مصنع المعادن",
		rating: 4.6,
		reviews: 60,
		stock: 5,
		shippingTime: "2 أيام",
		shippingCost: "20 جنيه",
	},
	{
		id: "m2",
		name: "مبخرة نحاسية",
		price: "160",
		image: "https://i.postimg.cc/9f20fMNq/main.jpg",
		views: 410,
		likes: 205,
		category: "المعادن",
		description: "مبخرة نحاسية جميلة",
		material: "نحاس",
		dimensions: "15 سم",
		weight: "0.5 كجم",
		manufacturer: "مصنع المعادن",
		rating: 4.8,
		reviews: 80,
		stock: 10,
		shippingTime: "3 أيام",
		shippingCost: "30 جنيه",
	},
	{
		id: "m3",
		name: "مجموعة أدوات مائدة نحاسية",
		price: "380",
		image: "https://i.postimg.cc/9f20fMNq/main.jpg",
		views: 340,
		likes: 170,
		category: "المعادن",
		description: "مجموعة أدوات مائدة نحاسية جميلة",
		material: "نحاس",
		dimensions: "20 سم",
		weight: "1 كجم",
		manufacturer: "مصنع المعادن",
		rating: 4.9,
		reviews: 100,
		stock: 15,
		shippingTime: "4 أيام",
		shippingCost: "50 جنيه",
	},
];

export default function BuyerHome() {
	const router = useRouter();
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
	const [isNavigating, setIsNavigating] = useState(false);

	useEffect(() => {
		loadProducts();
	}, []);

	const loadProducts = async () => {
		try {
			const storedProducts = await AsyncStorage.getItem("sellerProducts");
			if (storedProducts) {
				setProducts(JSON.parse(storedProducts));
			} else {
				// If no stored products, use static products
				setProducts(staticProducts);
			}
		} catch (error) {
			console.error("Error loading products:", error);
			// Fallback to static products on error
			setProducts(staticProducts);
		} finally {
			setLoading(false);
		}
	};

	const handleCategorySelect = (categoryName: string) => {
		setSelectedCategory(
			selectedCategory === categoryName ? null : categoryName
		);
	};

	const handleProductPress = (productId: string) => {
		console.log("Product pressed with ID:", productId);
		setIsNavigating(true);
		router.push(`/(buyer)/product-details?id=${productId}`);
	};

	// Filter products based on selected category
	const filteredProducts = selectedCategory
		? products.filter((product) => product.category === selectedCategory)
		: products;

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
		<View style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.title}>المنتجات</Text>
				<TouchableOpacity
					style={styles.favoritesButton}
					onPress={() => router.push("/(buyer)/favorites")}>
					<Text style={styles.favoritesButtonText}>المفضلة</Text>
				</TouchableOpacity>
			</View>
			<ScrollView
				style={[
					styles.container as ViewStyle,
					{ backgroundColor: theme.colors.background },
				]}>
				{/* Most Selling Section */}
				<View style={styles.section as ViewStyle}>
					<Text
						style={[
							styles.sectionTitle as TextStyle,
							{ color: theme.colors.text },
						]}>
						الأكثر مبيعاً
					</Text>
					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={styles.horizontalScroll}>
						{staticMostSellingProducts.map((product) => (
							<ProductCard
								key={product.id}
								product={product}
								onPress={() => handleProductPress(product.id)}
							/>
						))}
					</ScrollView>
				</View>

				{/* Categories Section */}
				<View style={styles.section as ViewStyle}>
					<Text
						style={[
							styles.sectionTitle as TextStyle,
							{ color: theme.colors.text },
						]}>
						التصنيفات
					</Text>
					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={styles.horizontalScroll}>
						{categories.map((category) => (
							<CategoryCard
								key={category.id}
								category={category}
								onPress={() => handleCategorySelect(category.name)}
								isSelected={selectedCategory === category.name}
							/>
						))}
					</ScrollView>
				</View>

				{/* Products Section */}
				<View style={styles.section as ViewStyle}>
					<View style={styles.productsHeader as ViewStyle}>
						<Text
							style={[
								styles.sectionTitle as TextStyle,
								{ color: theme.colors.text },
							]}>
							{selectedCategory
								? `منتجات ${selectedCategory}`
								: "جميع المنتجات"}
						</Text>
						{selectedCategory && (
							<TouchableOpacity
								onPress={() => setSelectedCategory(null)}
								style={[
									styles.clearFilterButton as ViewStyle,
									{ backgroundColor: theme.colors.primary },
								]}>
								<Text
									style={[
										styles.clearFilterText as TextStyle,
										{ color: theme.colors.white },
									]}>
									إلغاء التصفية
								</Text>
							</TouchableOpacity>
						)}
					</View>
					<View style={styles.productsGrid as ViewStyle}>
						{filteredProducts.length > 0 ? (
							filteredProducts.map((product) => (
								<ProductCard
									key={product.id}
									product={product}
									onPress={() => handleProductPress(product.id)}
								/>
							))
						) : (
							<View style={styles.emptyState as ViewStyle}>
								<Text
									style={[
										styles.emptyStateText as TextStyle,
										{ color: theme.colors.text },
									]}>
									لا توجد منتجات في هذا التصنيف
								</Text>
							</View>
						)}
					</View>
				</View>
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
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: theme.spacing.lg,
	},
	title: {
		fontSize: theme.typography.h2.fontSize,
		fontFamily: theme.typography.h2.fontFamily,
		color: theme.colors.text,
	},
	favoritesButton: {
		backgroundColor: theme.colors.primary,
		padding: theme.spacing.sm,
		borderRadius: theme.borderRadius.md,
	},
	favoritesButtonText: {
		color: theme.colors.white,
		fontSize: theme.typography.body.fontSize,
		fontFamily: theme.typography.body.fontFamily,
	},
	section: {
		padding: theme.spacing.lg,
	},
	sectionTitle: {
		fontSize: theme.typography.h2.fontSize,
		fontWeight: "700" as const,
		fontFamily: theme.typography.h2.fontFamily,
		textAlign: "right",
		marginBottom: theme.spacing.lg,
	},
	horizontalScroll: {
		paddingRight: theme.spacing.md,
		gap: theme.spacing.md,
	},
	productsGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between",
		gap: theme.spacing.md,
	},
	productCard: {
		width: 160,
		backgroundColor: theme.colors.secondary,
		borderRadius: theme.borderRadius.md,
		overflow: "hidden",
		marginBottom: theme.spacing.md,
	},
	productImage: {
		width: "100%",
		height: 120,
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
	},
	categoryCard: {
		width: 120,
		height: 120,
		borderRadius: theme.borderRadius.md,
		overflow: "hidden",
		marginRight: theme.spacing.md,
	},
	categoryImage: {
		width: "100%",
		height: "100%",
	},
	categoryOverlay: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: "rgba(0, 0, 0, 0.4)",
		justifyContent: "center",
		alignItems: "center",
	},
	categoryName: {
		fontSize: theme.typography.body.fontSize,
		fontWeight: "700" as const,
		fontFamily: theme.typography.body.fontFamily,
		textAlign: "center",
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
	productsHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: theme.spacing.lg,
	},
	clearFilterButton: {
		padding: theme.spacing.sm,
	},
	clearFilterText: {
		fontSize: theme.typography.body.fontSize,
		fontFamily: theme.typography.body.fontFamily,
	},
	emptyState: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		padding: theme.spacing.xl,
	},
	emptyStateText: {
		fontSize: theme.typography.body.fontSize,
		fontFamily: theme.typography.body.fontFamily,
		textAlign: "center",
	},
});
