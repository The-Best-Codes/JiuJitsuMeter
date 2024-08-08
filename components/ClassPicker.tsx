import React, { useState } from "react";
import { View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { TextInput, Button } from "react-native-paper";
import { Class } from "@/types";
import { addCustomClass } from "@/utils/storage";
import { useTheme } from "@/styles/theme";

interface ClassPickerProps {
  classes: Class[];
  selectedClass: string;
  onSelectClass: (classId: string) => void;
  setClasses: React.Dispatch<React.SetStateAction<Class[]>>;
}

export default function ClassPicker({
  classes,
  selectedClass,
  onSelectClass,
  setClasses,
}: ClassPickerProps) {
  const [newClassName, setNewClassName] = useState("");
  const [showNewClassInput, setShowNewClassInput] = useState(false);

  const theme = useTheme();

  const handleAddNewClass = async () => {
    if (newClassName.trim() && !classes.some((c) => c.class === newClassName)) {
      try {
        const newClass = await addCustomClass(newClassName);
        setClasses((prevClasses) => [...prevClasses, newClass]);
        onSelectClass(newClass.id);
        setNewClassName("");
        setShowNewClassInput(false);
      } catch (error) {
        console.error("Error adding new class:", error);
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
        selectedValue={selectedClass}
        onValueChange={(itemValue) => {
          if (itemValue === "add_new_class") {
            onSelectClass("");
            setShowNewClassInput(true);
          } else {
            setShowNewClassInput(false);
            onSelectClass(itemValue);
          }
        }}
      >
        <Picker.Item label="Select a class" value="" />
        {classes.map((classItem) => (
          <Picker.Item
            key={classItem.id}
            label={classItem.class}
            value={classItem.id}
          />
        ))}
        <Picker.Item label="Add new class" value="add_new_class" />
      </Picker>
      {showNewClassInput && (
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
            value={newClassName}
            style={{ flex: 1 }}
            onChangeText={setNewClassName}
            label="Enter new class name"
            mode="outlined"
          />
          <Button
            icon="plus"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 8,
              height: "auto",
            }}
            mode="contained"
            disabled={
              !newClassName.trim() ||
              classes.some((c) => c.class === newClassName)
            }
            onPress={handleAddNewClass}
          >
            Add
          </Button>
        </View>
      )}
    </View>
  );
}
