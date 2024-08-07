import AsyncStorage from "@react-native-async-storage/async-storage";
import { initialClasses } from "@/utils/constants";

export const loadCustomClasses = async () => {
  try {
    const customClassesData = await AsyncStorage.getItem("customClasses");
    return customClassesData ? JSON.parse(customClassesData) : null;
  } catch (error) {
    console.error("Error loading custom classes:", error);
    return null;
  }
};

export const saveCustomClasses = async (updatedClasses: any) => {
  try {
    const customClasses = { ...updatedClasses };
    Object.keys(initialClasses).forEach((key) => {
      delete customClasses[key];
    });
    await AsyncStorage.setItem("customClasses", JSON.stringify(customClasses));
  } catch (error) {
    console.error("Error saving custom classes:", error);
  }
};
