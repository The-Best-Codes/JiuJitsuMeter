import AsyncStorage from "@react-native-async-storage/async-storage";
import { initialClasses } from "@/utils/constants";
import { ClassItem } from "@/types";

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

export const fetchClasses = async (): Promise<ClassItem[]> => {
  try {
    const classesData = await AsyncStorage.getItem("classes");
    if (classesData) {
      const parsedData = JSON.parse(classesData);
      return Array.isArray(parsedData) ? parsedData : [];
    }
    return [];
  } catch (error) {
    console.error("Error fetching classes:", error);
    return [];
  }
};

export const deleteClass = async (id: string): Promise<void> => {
  try {
    const classes = await fetchClasses();
    const updatedClasses = classes.filter((classItem) => classItem.id !== id);
    await AsyncStorage.setItem("classes", JSON.stringify(updatedClasses));
  } catch (error) {
    console.error("Error deleting class:", error);
  }
};
