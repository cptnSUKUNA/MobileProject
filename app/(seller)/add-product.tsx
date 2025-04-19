/** @format */

import React, { useState } from "react";
import {
	View,
	Text,
	TextInput,
	StyleSheet,
	ViewStyle,
	TextStyle,
	TouchableOpacity,
	Image,
	Alert,
	ScrollView,
} from "react-native";
import { theme } from "../theme";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";

export default function AddProduct() {
	const router = useRouter();
	const [name, setName] = useState("");
	const [price, setPrice] = useState("");
	const [image, setImage] = useState("");
	const [description, setDescription] = useState("");
	const [material, setMaterial] = useState("");
	const [dimensions, setDimensions] = useState("");
	const [weight, setWeight] = useState("");
	const [manufacturer, setManufacturer] = useState("");
	const [stock, setStock] = useState("");
	const [shippingTime, setShippingTime] = useState("");
	const [shippingCost, setShippingCost] = useState("");

	const pickImage = async () => {
		const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (status !== "granted") {
			Alert.alert("تنبيه", "نحتاج إلى إذن للوصول إلى معرض الصور");
			return;
		}

		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});

		if (!result.canceled) {
			setImage(result.assets[0].uri);
		}
	};

	const handleAddProduct = async () => {
		if (
			!name ||
			!price ||
			!image ||
			!description ||
			!material ||
			!dimensions ||
			!weight ||
			!manufacturer ||
			!stock ||
			!shippingTime ||
			!shippingCost
		) {
			Alert.alert("تنبيه", "الرجاء إدخال جميع البيانات");
			return;
		}

		try {
			const newProduct = {
				id: Date.now().toString(),
				name,
				price,
				image,
				views: 0,
				likes: 0,
				description,
				material,
				dimensions,
				weight,
				manufacturer,
				rating: 0,
				reviews: 0,
				stock: parseInt(stock),
				shippingTime,
				shippingCost,
			};

			const storedProducts = await AsyncStorage.getItem("sellerProducts");
			const products = storedProducts ? JSON.parse(storedProducts) : [];
			const lastproduct = products[products.length - 1];
			products.push(newProduct);
			await AsyncStorage.setItem("sellerProducts", JSON.stringify(products));

			Alert.alert("نجاح", "تم إضافة المنتج بنجاح", [
				{
					text: "حسناً",
					onPress: () => router.back(),
				},
			]);
		} catch (error) {
			console.error("Error adding product:", error);
			Alert.alert("خطأ", "حدث خطأ أثناء إضافة المنتج");
		}
	};

	return (
		<ScrollView
			style={[
				styles.container as ViewStyle,
				{ backgroundColor: theme.colors.background },
			]}>
			<View style={styles.form as ViewStyle}>
				<TextInput
					style={[styles.input as TextStyle, { color: theme.colors.text }]}
					placeholder='اسم المنتج'
					placeholderTextColor={theme.colors.text + "80"}
					value={name}
					onChangeText={setName}
				/>

				<TextInput
					style={[styles.input as TextStyle, { color: theme.colors.text }]}
					placeholder='السعر'
					placeholderTextColor={theme.colors.text + "80"}
					value={price}
					onChangeText={setPrice}
					keyboardType='numeric'
				/>

				<TouchableOpacity
					style={[
						styles.imageButton as ViewStyle,
						{ backgroundColor: theme.colors.primary },
					]}
					onPress={pickImage}>
					<Text
						style={[
							styles.imageButtonText as TextStyle,
							{ color: theme.colors.white },
						]}>
						{image ? "تغيير الصورة" : "اختيار صورة"}
					</Text>
				</TouchableOpacity>

				{image && (
					<Image
						source={{ uri: image }}
						style={styles.previewImage}
						resizeMode='cover'
					/>
				)}

				<TextInput
					style={[styles.input as TextStyle, { color: theme.colors.text }]}
					placeholder='وصف المنتج'
					placeholderTextColor={theme.colors.text + "80"}
					value={description}
					onChangeText={setDescription}
					multiline
					numberOfLines={4}
				/>

				<TextInput
					style={[styles.input as TextStyle, { color: theme.colors.text }]}
					placeholder='المادة'
					placeholderTextColor={theme.colors.text + "80"}
					value={material}
					onChangeText={setMaterial}
				/>

				<TextInput
					style={[styles.input as TextStyle, { color: theme.colors.text }]}
					placeholder='الأبعاد'
					placeholderTextColor={theme.colors.text + "80"}
					value={dimensions}
					onChangeText={setDimensions}
				/>

				<TextInput
					style={[styles.input as TextStyle, { color: theme.colors.text }]}
					placeholder='الوزن'
					placeholderTextColor={theme.colors.text + "80"}
					value={weight}
					onChangeText={setWeight}
				/>

				<TextInput
					style={[styles.input as TextStyle, { color: theme.colors.text }]}
					placeholder='الشركة المصنعة'
					placeholderTextColor={theme.colors.text + "80"}
					value={manufacturer}
					onChangeText={setManufacturer}
				/>

				<TextInput
					style={[styles.input as TextStyle, { color: theme.colors.text }]}
					placeholder='المخزون'
					placeholderTextColor={theme.colors.text + "80"}
					value={stock}
					onChangeText={setStock}
					keyboardType='numeric'
				/>

				<TextInput
					style={[styles.input as TextStyle, { color: theme.colors.text }]}
					placeholder='وقت الشحن'
					placeholderTextColor={theme.colors.text + "80"}
					value={shippingTime}
					onChangeText={setShippingTime}
				/>

				<TextInput
					style={[styles.input as TextStyle, { color: theme.colors.text }]}
					placeholder='تكلفة الشحن'
					placeholderTextColor={theme.colors.text + "80"}
					value={shippingCost}
					onChangeText={setShippingCost}
				/>

				<TouchableOpacity
					style={[
						styles.button as ViewStyle,
						{ backgroundColor: theme.colors.primary },
					]}
					onPress={handleAddProduct}>
					<Text
						style={[
							styles.buttonText as TextStyle,
							{ color: theme.colors.white },
						]}>
						إضافة المنتج
					</Text>
				</TouchableOpacity>
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: theme.spacing.lg,
	},
	form: {
		gap: theme.spacing.lg,
	},
	input: {
		borderWidth: 1,
		borderColor: theme.colors.primary,
		borderRadius: theme.borderRadius.md,
		padding: theme.spacing.md,
		fontSize: theme.typography.body.fontSize,
		fontFamily: theme.typography.body.fontFamily,
		textAlign: "right",
	},
	button: {
		padding: theme.spacing.md,
		borderRadius: theme.borderRadius.md,
		alignItems: "center",
	},
	buttonText: {
		fontSize: theme.typography.body.fontSize,
		fontWeight: "700" as const,
		fontFamily: theme.typography.body.fontFamily,
	},
	imageButton: {
		padding: theme.spacing.md,
		borderRadius: theme.borderRadius.md,
		alignItems: "center",
		marginBottom: theme.spacing.md,
	},
	imageButtonText: {
		fontSize: theme.typography.body.fontSize,
		fontWeight: "700" as const,
		fontFamily: theme.typography.body.fontFamily,
	},
	previewImage: {
		width: "100%",
		height: 200,
		borderRadius: theme.borderRadius.md,
		marginBottom: theme.spacing.md,
	},
});
