import React, { useState, useEffect } from "react";
import { View, ScrollView, RefreshControl, Alert } from "react-native";
import { Provider as PaperProvider, Button, Text } from "react-native-paper";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import ClassPicker from "@/components/ClassPicker";
import LessonPicker from "@/components/LessonPicker";
import DateTimePicker from "@/components/DateTimePicker";
import NoteInput from "@/components/NoteInput";
import { useTheme } from "@/styles/theme";
import { initialClasses } from "@/utils/constants";
import { Class } from "@/types";
import { loadCustomClasses, saveClassLog } from "@/utils/storage";
import i18n from "@/i18n";

export default function App() {
  const [classes, setClasses] = useState<Class[]>(initialClasses);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedLesson, setSelectedLesson] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [note, setNote] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(true);

  const theme = useTheme();

  const loadClasses = async () => {
    setIsRefreshing(true);
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
    setIsRefreshing(false);
  };

  useEffect(() => {
    loadClasses();
  }, []);

  const handleSaveClass = async () => {
    setIsSaving(true);
    try {
      const classLog = {
        id: uuidv4(),
        classId: selectedClass,
        lessonId: selectedLesson,
        date: selectedDate,
        time: selectedTime,
        note,
      };

      await saveClassLog(classLog);
      Alert.alert(i18n.t("status.success"), i18n.t("classes.classSaveSuccess"));
      resetForm();
    } catch (error) {
      console.error("Error saving class:", error);
      Alert.alert(i18n.t("status.error"), i18n.t("classes.classSaveFailed"));
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
    loadClasses();
  };

  const handleClassSelect = (classId: string) => {
    if (classId && classId !== "add_new_class") {
      setSelectedClass(classId);
      setStep(2);
    } else {
      setSelectedClass("");
      setStep(1);
    }
  };

  const handleLessonSelect = (lessonId: string) => {
    if (lessonId) {
      setSelectedLesson(lessonId);
      setStep(3);
    } else {
      setSelectedLesson("");
      setStep(2);
    }
  };

  const handleDateTimeSelect = (date: Date, time: Date) => {
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
        <ScrollView
          contentContainerStyle={{ padding: 20 }}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={resetForm} />
          }
        >
          <Text
            style={{
              fontSize: 28,
              fontWeight: "bold",
              marginTop: 16,
              marginBottom: 24,
              textAlign: "center",
            }}
          >
            {i18n.t("lessons.saveALesson")}
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
            {isSaving
              ? i18n.t("feedback.saving-ellipsis")
              : i18n.t("lessons.saveLesson")}
          </Button>
        </View>
      </View>
    </PaperProvider>
  );
}
