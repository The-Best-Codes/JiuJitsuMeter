import React, { useState } from "react";
import { View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { TextInput, Button } from "react-native-paper";
import { saveCustomClasses } from "@/utils/storage";
import { useTheme } from "@/styles/theme";

export default function LessonPicker({
  classes,
  selectedClass,
  selectedLesson,
  onSelectLesson,
  setClasses,
}: any) {
  const [newLessonName, setNewLessonName] = useState("");
  const [showNewLessonInput, setShowNewLessonInput] = useState(false);

  const theme = useTheme();

  const handleAddNewLesson = () => {
    if (
      newLessonName.trim() &&
      selectedClass &&
      !classes[selectedClass].includes(newLessonName)
    ) {
      const updatedClasses = {
        ...classes,
        [selectedClass]: [...classes[selectedClass], newLessonName],
      };
      setClasses(updatedClasses);
      saveCustomClasses(updatedClasses);
      onSelectLesson(newLessonName);
      setNewLessonName("");
      setShowNewLessonInput(false);
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
        {classes[selectedClass] &&
          classes[selectedClass].map((lesson: string) => (
            <Picker.Item key={lesson} label={lesson} value={lesson} />
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
            label={"Enter new lesson name"}
            mode="outlined"
          />
          <Button
            icon={"plus"}
            mode="contained"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 8,
              height: "auto",
            }}
            onPress={handleAddNewLesson}
          >
            Add
          </Button>
        </View>
      )}
    </View>
  );
}
