import React, { useState, useEffect } from "react";
import { View, ScrollView, Alert, Modal } from "react-native";
import {
  Provider as PaperProvider,
  Button,
  Text,
  IconButton,
  Portal,
  TextInput,
  Divider,
} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@/styles/theme";
import { initialClasses } from "@/utils/constants";
import { loadCustomClasses, saveCustomClasses } from "@/utils/storage";

interface Classes {
  [className: string]: string[];
}

export default function App() {
  const [classes, setClasses] = useState<Classes>(initialClasses);
  const [selectedClass, setSelectedClass] = useState("");
  const [newClassName, setNewClassName] = useState("");
  const [newLessonName, setNewLessonName] = useState("");
  const [showNewClassInput, setShowNewClassInput] = useState(false);
  const [showNewLessonModal, setShowNewLessonModal] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    loadCustomClasses().then((customClasses) => {
      if (customClasses) {
        setClasses({ ...initialClasses, ...customClasses });
      }
    });
  }, []);

  const handleAddClass = (className: string) => {
    if (className.trim() && !classes[className]) {
      const updatedClasses = { ...classes, [className]: [] };
      setClasses(updatedClasses);
      saveCustomClasses(updatedClasses);
      setNewClassName("");
      setShowNewClassInput(false);
    } else {
      Alert.alert("Error", "Class already exists or name is invalid.");
    }
  };

  const handleAddLesson = (className: string, lessonName: string) => {
    if (
      lessonName.trim() &&
      className &&
      !classes[className].includes(lessonName)
    ) {
      const updatedClasses = {
        ...classes,
        [className]: [...classes[className], lessonName],
      };
      setClasses(updatedClasses);
      saveCustomClasses(updatedClasses);
      setNewLessonName("");
      setShowNewLessonModal(false);
    } else {
      Alert.alert("Error", "Lesson already exists or name is invalid.");
    }
  };

  const handleDeleteClass = (className: string) => {
    Alert.alert(
      "Delete Class",
      `Are you sure you want to delete the class "${className}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            const updatedClasses = { ...classes };
            delete updatedClasses[className];
            setClasses(updatedClasses);
            saveCustomClasses(updatedClasses);
          },
          style: "destructive",
        },
      ],
      { cancelable: false }
    );
  };

  const handleDeleteLesson = (className: string, lessonName: string) => {
    Alert.alert(
      "Delete Lesson",
      `Are you sure you want to delete the lesson "${lessonName}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            const updatedLessons = classes[className].filter(
              (lesson) => lesson !== lessonName
            );
            const updatedClasses = { ...classes, [className]: updatedLessons };
            setClasses(updatedClasses);
            saveCustomClasses(updatedClasses);
          },
          style: "destructive",
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <PaperProvider theme={theme}>
      <View style={{ flex: 1, padding: 32 }}>
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
            Custom Classes and Lessons
          </Text>
          {Object.entries(classes).map(([className, lessons]) => (
            <View key={className} style={{ marginBottom: 20 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={{ fontSize: 24, fontWeight: "bold" }}>
                  {className}
                </Text>
                <IconButton
                  icon="plus"
                  size={20}
                  onPress={() => {
                    setSelectedClass(className);
                    setShowNewLessonModal(true);
                  }}
                />
                {!initialClasses[className] && (
                  <IconButton
                    icon="delete"
                    size={20}
                    onPress={() => handleDeleteClass(className)}
                  />
                )}
              </View>
              {lessons.length > 0 ? (
                lessons.map((lesson, index) => (
                  <View
                    key={index}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginLeft: 10,
                    }}
                  >
                    <Text>- {lesson}</Text>
                    {!initialClasses[className] && (
                      <IconButton
                        icon="delete"
                        size={16}
                        onPress={() => handleDeleteLesson(className, lesson)}
                      />
                    )}
                  </View>
                ))
              ) : (
                <Text style={{ marginLeft: 10 }}>No lessons available</Text>
              )}
            </View>
          ))}
          <Divider style={{ marginTop: 40, marginBottom: 10 }} />
          {showNewClassInput && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 16,
              }}
            >
              <TextInput
                placeholder="Enter new class name"
                mode="outlined"
                label="Class Name"
                value={newClassName}
                onChangeText={setNewClassName}
                style={{
                  flex: 1,
                  marginRight: 8,
                }}
              />
              <Button
                mode="contained"
                onPress={() => handleAddClass(newClassName)}
                disabled={!newClassName.trim()}
              >
                Add
              </Button>
              <Button mode="text" onPress={() => setShowNewClassInput(false)}>
                Cancel
              </Button>
            </View>
          )}
          <Button
            mode="contained"
            onPress={() => setShowNewClassInput(true)}
            style={{ marginTop: 20 }}
          >
            Add New Class
          </Button>
        </ScrollView>
        <Portal>
          <Modal
            visible={showNewLessonModal}
            onDismiss={() => setShowNewLessonModal(false)}
          >
            <View
              style={{
                backgroundColor: "white",
                padding: 20,
                margin: 20,
                borderRadius: 10,
              }}
            >
              <Text style={{ fontSize: 18, marginBottom: 10 }}>
                Add new lesson for {selectedClass}
              </Text>
              <TextInput
                mode="outlined"
                label="New Lesson Name"
                placeholder="Enter new lesson name"
                value={newLessonName}
                onChangeText={setNewLessonName}
                style={{
                  marginBottom: 10,
                }}
              />
              <View
                style={{ flexDirection: "row", justifyContent: "flex-end" }}
              >
                <Button
                  mode="text"
                  onPress={() => setShowNewLessonModal(false)}
                  style={{ marginRight: 10 }}
                >
                  Cancel
                </Button>
                <Button
                  mode="contained"
                  onPress={() => handleAddLesson(selectedClass, newLessonName)}
                  disabled={!newLessonName.trim()}
                >
                  Add
                </Button>
              </View>
            </View>
          </Modal>
        </Portal>
      </View>
    </PaperProvider>
  );
}
