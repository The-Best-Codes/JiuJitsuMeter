import React, { useState, useEffect } from "react";
import { View, ScrollView, Alert } from "react-native";
import { Provider as PaperProvider, Button, Text } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import ClassPicker from "@/components/ClassPicker";
import LessonPicker from "@/components/LessonPicker";
import DateTimePicker from "@/components/DateTimePicker";
import NoteInput from "@/components/NoteInput";
import { useTheme } from "@/styles/theme";
import { initialClasses } from "@/utils/constants";
import { loadCustomClasses, saveCustomClasses } from "@/utils/storage";

export default function App() {
  const [classes, setClasses] = useState(initialClasses);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedLesson, setSelectedLesson] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [note, setNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [step, setStep] = useState(1);

  const theme = useTheme();

  useEffect(() => {
    loadCustomClasses().then((customClasses) => {
      if (customClasses) {
        setClasses({ ...initialClasses, ...customClasses });
      }
    });
  }, []);

  const handleSaveClass = async () => {
    setIsSaving(true);
    try {
      const classesData = await AsyncStorage.getItem("classes");
      const currentClasses = classesData ? JSON.parse(classesData) : [];

      currentClasses.unshift({
        id: uuidv4(),
        selectedClass,
        selectedLesson,
        selectedDate,
        selectedTime,
        note,
      });

      await AsyncStorage.setItem("classes", JSON.stringify(currentClasses));
      Alert.alert("Success", "Class saved successfully!");
      resetForm();
    } catch (error) {
      console.error("Error saving class:", error);
      Alert.alert("Error", "Failed to save class. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    setSelectedClass("");
    setSelectedLesson("");
    setSelectedDate(null);
    setSelectedTime(null);
    setNote("");
    setStep(1);
  };

  const handleClassSelect = (className: string) => {
    if (className && className !== "add_new_class") {
      setSelectedClass(className);
      setStep(2);
    } else {
      setSelectedClass("");
      setStep(1);
    }
  };

  const handleLessonSelect = (lesson: string) => {
    if (lesson) {
      setSelectedLesson(lesson);
      setStep(3);
    } else {
      setSelectedLesson("");
      setStep(2);
    }
  };

  const handleDateTimeSelect = (date: any, time: any) => {
    setSelectedDate(date);
    setSelectedTime(time);
    setStep(4);
  };

  const handleNoteChange = (text: string) => {
    setNote(text);
    if (text && step === 4) {
      setStep(5);
    } else if (!text && step === 5) {
      setStep(4);
    }
  };

  const isFormValid =
    selectedClass && selectedLesson && selectedDate && selectedTime;

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
            Save a Class
          </Text>
          <ClassPicker
            classes={classes}
            selectedClass={selectedClass}
            onSelectClass={handleClassSelect}
            setClasses={setClasses}
          />
          {step >= 2 && (
            <LessonPicker
              classes={classes}
              selectedClass={selectedClass}
              selectedLesson={selectedLesson}
              onSelectLesson={handleLessonSelect}
              setClasses={setClasses}
            />
          )}
          {step >= 3 && (
            <DateTimePicker
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onSelectDateTime={handleDateTimeSelect}
            />
          )}
          {step >= 4 && (
            <NoteInput note={note} onChangeNote={handleNoteChange} />
          )}
        </ScrollView>
        <View style={{ padding: 20 }}>
          <Button
            mode="contained"
            onPress={handleSaveClass}
            disabled={!isFormValid || isSaving}
          >
            {isSaving ? "Saving..." : "Save Class"}
          </Button>
        </View>
      </View>
    </PaperProvider>
  );
}
