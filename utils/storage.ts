import AsyncStorage from "@react-native-async-storage/async-storage";
import { initialClasses } from "@/utils/constants";

import { Class, Lesson, ClassLog } from "@/types";

// Load custom classes
export const loadCustomClasses = async (): Promise<Class[]> => {
  try {
    const customClassesData = await AsyncStorage.getItem("customClasses");
    const customClasses = customClassesData
      ? JSON.parse(customClassesData)
      : [];
    return [...initialClasses, ...customClasses];
  } catch (error) {
    console.error("Error loading custom classes:", error);
    return [...initialClasses];
  }
};

// Add custom class
export const addCustomClass = async (className: string): Promise<Class> => {
  try {
    const classes = await loadCustomClasses();
    const newClass: Class = {
      id: `custom_${Date.now()}`,
      class: className,
      data: [],
    };
    const updatedClasses = [...classes, newClass];
    await AsyncStorage.setItem("customClasses", JSON.stringify(updatedClasses));
    return newClass;
  } catch (error) {
    console.error("Error adding custom class:", error);
    throw error;
  }
};

// Edit custom class
export const editCustomClass = async (
  id: string,
  newClassName: string
): Promise<void> => {
  try {
    const classes = await loadCustomClasses();
    const updatedClasses = classes.map((c) =>
      c.id === id ? { ...c, class: newClassName } : c
    );
    await AsyncStorage.setItem("customClasses", JSON.stringify(updatedClasses));
  } catch (error) {
    console.error("Error editing custom class:", error);
    throw error;
  }
};

// Delete custom class
export const deleteCustomClass = async (id: string): Promise<void> => {
  try {
    const classes = await loadCustomClasses();
    const updatedClasses = classes.filter((c) => c.id !== id);
    await AsyncStorage.setItem("customClasses", JSON.stringify(updatedClasses));
  } catch (error) {
    console.error("Error deleting custom class:", error);
    throw error;
  }
};

// Add custom lesson
export const addCustomLesson = async (
  classId: string,
  lessonName: string
): Promise<Lesson> => {
  try {
    const classes = await loadCustomClasses();
    const classIndex = classes.findIndex((c) => c.id === classId);
    if (classIndex === -1) throw new Error("Class not found");

    const newLesson: Lesson = {
      id: `lesson_${Date.now()}`,
      name: lessonName,
    };
    classes[classIndex].data.push(newLesson);
    await AsyncStorage.setItem("customClasses", JSON.stringify(classes));
    return newLesson;
  } catch (error) {
    console.error("Error adding custom lesson:", error);
    throw error;
  }
};

// Edit custom lesson
export const editCustomLesson = async (
  classId: string,
  lessonId: string,
  newLessonName: string
): Promise<void> => {
  try {
    const classes = await loadCustomClasses();
    const classIndex = classes.findIndex((c) => c.id === classId);
    if (classIndex === -1) throw new Error("Class not found");

    const lessonIndex = classes[classIndex].data.findIndex(
      (l) => l.id === lessonId
    );
    if (lessonIndex === -1) throw new Error("Lesson not found");

    classes[classIndex].data[lessonIndex].name = newLessonName;
    await AsyncStorage.setItem("customClasses", JSON.stringify(classes));
  } catch (error) {
    console.error("Error editing custom lesson:", error);
    throw error;
  }
};

// Delete custom lesson
export const deleteCustomLesson = async (
  classId: string,
  lessonId: string
): Promise<void> => {
  try {
    const classes = await loadCustomClasses();
    const classIndex = classes.findIndex((c) => c.id === classId);
    if (classIndex === -1) throw new Error("Class not found");

    classes[classIndex].data = classes[classIndex].data.filter(
      (l) => l.id !== lessonId
    );
    await AsyncStorage.setItem("customClasses", JSON.stringify(classes));
  } catch (error) {
    console.error("Error deleting custom lesson:", error);
    throw error;
  }
};

// Fetch class logs
export const fetchClassLogs = async (): Promise<ClassLog[]> => {
  try {
    const classLogsData = await AsyncStorage.getItem("classLogs");
    if (classLogsData) {
      const parsedData = JSON.parse(classLogsData);
      return Array.isArray(parsedData) ? parsedData : [];
    }
    return [];
  } catch (error) {
    console.error("Error fetching class logs:", error);
    return [];
  }
};

// Save class log
export const saveClassLog = async (classLog: ClassLog): Promise<void> => {
  try {
    const classLogs = await fetchClassLogs();
    const updatedClassLogs = [...classLogs, classLog];
    await AsyncStorage.setItem("classLogs", JSON.stringify(updatedClassLogs));
  } catch (error) {
    console.error("Error saving class log:", error);
    throw error;
  }
};

// Delete class log
export const deleteClassLog = async (id: string): Promise<void> => {
  try {
    const classLogs = await fetchClassLogs();
    const updatedClassLogs = classLogs.filter((log) => log.id !== id);
    await AsyncStorage.setItem("classLogs", JSON.stringify(updatedClassLogs));
  } catch (error) {
    console.error("Error deleting class log:", error);
    throw error;
  }
};

// Update class log
export const updateClassLog = async (updatedLog: ClassLog): Promise<void> => {
  try {
    const classLogs = await fetchClassLogs();
    const updatedClassLogs = classLogs.map((log) =>
      log.id === updatedLog.id ? updatedLog : log
    );
    await AsyncStorage.setItem("classLogs", JSON.stringify(updatedClassLogs));
  } catch (error) {
    console.error("Error updating class log:", error);
    throw error;
  }
};
