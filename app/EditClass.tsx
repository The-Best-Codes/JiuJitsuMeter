import React, { useState, useEffect } from "react";
import { View, ScrollView, Alert } from "react-native";
import { Provider as PaperProvider, Button, Text } from "react-native-paper";
import { useRoute, useNavigation } from "@react-navigation/native";
import { ClassItem } from "@/types";
import { updateClass } from "@/utils/storage";
import ClassPicker from "@/components/ClassPicker";
import LessonPicker from "@/components/LessonPicker";
import DateTimePicker from "@/components/DateTimePicker";
import NoteInput from "@/components/NoteInput";
import { useTheme } from "@/styles/theme";
import { initialClasses } from "@/utils/constants";
import { loadCustomClasses } from "@/utils/storage";

const EditClass: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { classItem } = route.params as { classItem: ClassItem };
  const { onSave }: any = navigation
    .getState()
    ?.routes.find((route) => route.name === "EditClass")?.params;

  const [classes, setClasses] = useState(initialClasses);
  const [editedClass, setEditedClass] = useState<ClassItem>({
    id: classItem.id || "",
    selectedClass: classItem.selectedClass || "",
    selectedLesson: classItem.selectedLesson || "",
    selectedDate: classItem.selectedDate
      ? (new Date(classItem.selectedDate) as any)
      : new Date(),
    selectedTime: classItem.selectedTime
      ? (new Date(classItem.selectedTime) as any)
      : new Date(),
    note: classItem.note || "",
  });
  const [isSaving, setIsSaving] = useState(false);

  const theme = useTheme();

  useEffect(() => {
    loadCustomClasses().then((customClasses) => {
      if (customClasses) {
        setClasses({ ...initialClasses, ...customClasses });
      }
    });
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateClass(editedClass);
      Alert.alert("Success", "Class updated successfully!");
      if (onSave) onSave(editedClass);
    } catch (error) {
      console.error("Error updating class:", error);
      Alert.alert("Error", "Failed to update class. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleClassSelect = (className: string) => {
    setEditedClass({ ...editedClass, selectedClass: className });
  };

  const handleLessonSelect = (lesson: string) => {
    setEditedClass({ ...editedClass, selectedLesson: lesson });
  };

  const handleDateTimeSelect = (date: any, time: any) => {
    setEditedClass({ ...editedClass, selectedDate: date, selectedTime: time });
  };

  const handleNoteChange = (text: string) => {
    setEditedClass({ ...editedClass, note: text });
  };

  const isFormValid =
    editedClass.selectedClass &&
    editedClass.selectedLesson &&
    editedClass.selectedDate &&
    editedClass.selectedTime;

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
            Edit Class
          </Text>
          <ClassPicker
            classes={classes}
            selectedClass={editedClass.selectedClass}
            onSelectClass={handleClassSelect}
            setClasses={setClasses}
          />
          <LessonPicker
            classes={classes}
            selectedClass={editedClass.selectedClass}
            selectedLesson={editedClass.selectedLesson}
            onSelectLesson={handleLessonSelect}
            setClasses={setClasses}
          />
          <DateTimePicker
            selectedDate={editedClass.selectedDate}
            selectedTime={editedClass.selectedTime}
            onSelectDateTime={handleDateTimeSelect}
          />
          <NoteInput note={editedClass.note} onChangeNote={handleNoteChange} />
        </ScrollView>
        <View style={{ padding: 20 }}>
          <Button
            mode="contained"
            onPress={handleSave}
            disabled={!isFormValid || isSaving}
          >
            {isSaving ? "Saving..." : "Update Class"}
          </Button>
        </View>
      </View>
    </PaperProvider>
  );
};

export default EditClass;
