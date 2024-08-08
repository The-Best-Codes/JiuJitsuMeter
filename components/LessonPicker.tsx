import React, { useState } from "react";
import { View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { TextInput, Button } from "react-native-paper";
import { Class, Lesson } from "@/types";
import { addCustomLesson } from "@/utils/storage";
import { useTheme } from "@/styles/theme";

interface LessonPickerProps {
  classes: Class[];
  selectedClass: string;
  selectedLesson: string;
  onSelectLesson: (lessonId: string) => void;
  setClasses: React.Dispatch<React.SetStateAction<Class[]>>;
}

export default function LessonPicker({
  classes,
  selectedClass,
  selectedLesson,
  onSelectLesson,
  setClasses,
}: LessonPickerProps) {
  const [newLessonName, setNewLessonName] = useState("");
  const [showNewLessonInput, setShowNewLessonInput] = useState(false);

  const theme = useTheme();

  const selectedClassObject = classes.find((c) => c.id === selectedClass);

  const handleAddNewLesson = async () => {
    if (
      newLessonName.trim() &&
      selectedClass &&
      selectedClassObject &&
      !selectedClassObject.data.some((lesson) => lesson.name === newLessonName)
    ) {
      try {
        const newLesson = await addCustomLesson(selectedClass, newLessonName);
        setClasses((prevClasses) =>
          prevClasses.map((c) =>
            c.id === selectedClass ? { ...c, data: [...c.data, newLesson] } : c
          )
        );
        onSelectLesson(newLesson.id);
        setNewLessonName("");
        setShowNewLessonInput(false);
      } catch (error) {
        console.error("Error adding new lesson:", error);
      }
    }
  };

  return (
    <View style={{ marginTop: 16 }}>
      <Picker
        style={{
          backgroundColor: theme.colors.primaryContainer,
          color: theme.colors.onPrimaryContainer,
        }}
        selectedValue={selectedLesson}
        onValueChange={(itemValue) => {
          if (itemValue === "add_new_lesson") {
            onSelectLesson("");
            setShowNewLessonInput(true);
          } else {
            setShowNewLessonInput(false);
            onSelectLesson(itemValue);
          }
        }}
      >
        <Picker.Item label="Select a lesson" value="" />
        {selectedClassObject &&
          selectedClassObject.data.map((lesson: Lesson) => (
            <Picker.Item
              key={lesson.id}
              label={lesson.name}
              value={lesson.id}
            />
          ))}
        <Picker.Item label="Add new lesson" value="add_new_lesson" />
      </Picker>
      {showNewLessonInput && (
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 8,
            marginTop: 8,
          }}
        >
          <TextInput
            value={newLessonName}
            style={{ flex: 1 }}
            onChangeText={setNewLessonName}
            label="Enter new lesson name"
            mode="outlined"
          />
          <Button
            icon="plus"
            mode="contained"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 8,
              height: "auto",
            }}
            disabled={
              !newLessonName.trim() ||
              (selectedClassObject &&
                selectedClassObject.data.some(
                  (lesson) => lesson.name === newLessonName
                ))
            }
            onPress={handleAddNewLesson}
          >
            Add
          </Button>
        </View>
      )}
    </View>
  );
}
