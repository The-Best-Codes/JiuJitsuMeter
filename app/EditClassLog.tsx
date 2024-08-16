import React, { useState, useEffect, useLayoutEffect } from "react";
import { View, ScrollView, Alert } from "react-native";
import { Provider as PaperProvider, Button, Text } from "react-native-paper";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Class, ClassLog } from "@/types";
import { updateClassLog, loadCustomClasses } from "@/utils/storage";
import ClassPicker from "@/components/ClassPicker";
import LessonPicker from "@/components/LessonPicker";
import DateTimePicker from "@/components/DateTimePicker";
import NoteInput from "@/components/NoteInput";
import { useTheme } from "@/styles/theme";
import { initialClasses } from "@/utils/constants";

const EditClass: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { classLog, onSave } = route.params as {
    classLog: ClassLog;
    onSave: () => void;
  };

  const [classes, setClasses] = useState<Class[]>([]);
  const [editedClassLog, setEditedClassLog] = useState<ClassLog>({
    id: classLog.id,
    classId: classLog.classId,
    lessonId: classLog.lessonId,
    date: new Date(classLog.date || Date.now()),
    time: new Date(classLog.time || Date.now()),
    note: classLog.note || "",
  });
  const [isSaving, setIsSaving] = useState(false);

  const theme = useTheme();

  const loadClasses = async () => {
    const customClasses = await loadCustomClasses();
    const classMap: { [id: string]: Class } = {};

    // Add initial classes to the map
    initialClasses.forEach((initialClass: Class) => {
      classMap[initialClass.id] = { ...initialClass };
    });

    // Add custom classes to the map, merging lessons if class already exists
    customClasses.forEach((customClass) => {
      if (classMap[customClass.id]) {
        const existingClass = classMap[customClass.id];
        const existingLessonIds = new Set(
          existingClass.data.map((lesson) => lesson.id)
        );

        const mergedLessons = [
          ...existingClass.data,
          ...customClass.data.filter(
            (lesson) => !existingLessonIds.has(lesson.id)
          ),
        ];

        classMap[customClass.id] = {
          ...existingClass,
          data: mergedLessons,
        };
      } else {
        classMap[customClass.id] = { ...customClass };
      }
    });

    const mergedClasses = Object.values(classMap);
    setClasses(mergedClasses);
  };

  useEffect(() => {
    loadClasses();
  }, []);

  useLayoutEffect(() => {
    const className =
      classes.find((c) => c.id === classLog.classId)?.class || "Unknown";
    navigation.setOptions({
      title: `Edit ${className} Lesson`,
    });
  }, [navigation, classLog.classId, classes]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateClassLog(editedClassLog);
      Alert.alert("Success", "Class log updated successfully!");
      if (onSave) {
        onSave(); // Call the callback function
      }
      navigation.goBack(); // Navigate back after successful update
    } catch (error) {
      console.error("Error updating class log:", error);
      Alert.alert("Error", "Failed to update class log. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleClassSelect = (classId: string) => {
    setEditedClassLog({ ...editedClassLog, classId, lessonId: "" });
  };

  const handleLessonSelect = (lessonId: string) => {
    setEditedClassLog({ ...editedClassLog, lessonId });
  };

  const handleDateTimeSelect = (date: Date, time: Date) => {
    setEditedClassLog({ ...editedClassLog, date, time });
  };

  const handleNoteChange = (text: string) => {
    setEditedClassLog({ ...editedClassLog, note: text });
  };

  const isFormValid =
    editedClassLog.classId &&
    editedClassLog.lessonId &&
    editedClassLog.date &&
    editedClassLog.time;

  return (
    <PaperProvider theme={theme}>
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <Text
            style={{
              fontSize: 28,
              fontWeight: "bold",
              marginTop: 16,
              marginBottom: 24,
              textAlign: "center",
            }}
          >
            Edit Lesson Log
          </Text>
          <ClassPicker
            classes={classes}
            selectedClass={editedClassLog.classId}
            onSelectClass={handleClassSelect}
            setClasses={setClasses}
          />
          <LessonPicker
            classes={classes}
            selectedClass={editedClassLog.classId}
            selectedLesson={editedClassLog.lessonId}
            onSelectLesson={handleLessonSelect}
            setClasses={setClasses}
          />
          <DateTimePicker
            selectedDate={editedClassLog.date}
            selectedTime={editedClassLog.time}
            onSelectDateTime={handleDateTimeSelect}
          />
          <NoteInput
            note={editedClassLog.note}
            onChangeNote={handleNoteChange}
          />
        </ScrollView>
        <View style={{ padding: 20 }}>
          <Button
            mode="contained"
            onPress={handleSave}
            disabled={!isFormValid || isSaving}
          >
            {isSaving ? "Saving..." : "Update Lesson Log"}
          </Button>
        </View>
      </View>
    </PaperProvider>
  );
};

export default EditClass;
