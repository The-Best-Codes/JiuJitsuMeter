import React, { useState } from "react";
import { View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { TextInput, Button } from "react-native-paper";
import { saveCustomClasses } from "@/utils/storage";
import { useTheme } from "@/styles/theme";

export default function ClassPicker({
  classes,
  selectedClass,
  onSelectClass,
  setClasses,
}: any) {
  const [newClassName, setNewClassName] = useState("");
  const [showNewClassInput, setShowNewClassInput] = useState(false);

  const theme = useTheme();

  const handleAddNewClass = () => {
    if (newClassName.trim() && !classes[newClassName]) {
      const updatedClasses = { ...classes, [newClassName]: [] };
      setClasses(updatedClasses);
      saveCustomClasses(updatedClasses);
      onSelectClass(newClassName);
      setNewClassName("");
      setShowNewClassInput(false);
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
        {Object.keys(classes).map((className) => (
          <Picker.Item key={className} label={className} value={className} />
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
            label={"Enter new class name"}
            mode="outlined"
          />
          <Button
            icon={"plus"}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 8,
              height: "auto",
            }}
            mode="contained"
            onPress={handleAddNewClass}
          >
            Add
          </Button>
        </View>
      )}
    </View>
  );
}
