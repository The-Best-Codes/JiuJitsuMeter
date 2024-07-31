import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Animated,
  useWindowDimensions,
  useColorScheme,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

const initialClasses: any = {
  "Master Cycle": [],
  "Gracie Combatives": [
    "Trap and Roll Escape - Mount (GU 1) | Leg Hook Takedown (GU 6)",
    "Americana Armlock - Mount (GU 2) | Clinch (Aggressive Opponent) (GU 7)",
    "Positional Control - Mount (GU 3) | Body Fold Takedown (GU 14)",
    "Take the Back + R.N.C. - Mount (GU 4 + 5) | Clinch (Conservative Opponent) (GU 15)",
    "Punch Block Series (1-4) - Guard (GU 8) | Guillotine Choke (Standing) (GU 23)",
    "Straight Armbar - Mount (GU 9) | Guillotine Defense (GU 32)",
    "Triangle Choke - Gaurd (GU 10) | Haymaker Punch Defense (GU 30)",
    "Elevator Sweep - Gaurd (GU 11) | Rear Takedown (GU 29)",
    "Elbow Escape - Mount (GU 12) | Pull Guard (GU 21)",
    "Position Control - Side Mount (GU 13) | Double Leg Takedown (Aggressive) (GU 17)",
    "Headlock Counters - Mount (GU 16) | Standing Headlock Defense (GU 26)",
    "Headlock Escape 1 - Side Mount (GU 18) | Straight Armbar - Guard (GU 34)",
    "Straight Armbar - Guard (GU 19) | Clinch (Aggressive Opponent) (GU 7)",
    "Double Ankle Sweep - Guard (GU 20) | Guillotine Choke (Gaurd Pull) (GU 23)",
  ],
  "Women Empowered": [],
  "Reflex Developement": [],
  "Jr Grapplers": [],
  "Black Belt Club": [],
  "Private Lesson": [],
  "Group Lesson": [],
  "WE Seminar": [],
  "GC Seminar": [],
  "Gracie Game Day": [],
  "Parent's Day": [],
  "Open Mat": [],
  "Little Champs": [],
};

const originalClasses: any = {
  "Master Cycle": [],
  "Gracie Combatives": [
    "Trap and Roll Escape - Mount (GU 1) | Leg Hook Takedown (GU 6)",
    "Americana Armlock - Mount (GU 2) | Clinch (Aggressive Opponent) (GU 7)",
    "Positional Control - Mount (GU 3) | Body Fold Takedown (GU 14)",
    "Take the Back + R.N.C. - Mount (GU 4 + 5) | Clinch (Conservative Opponent) (GU 15)",
    "Punch Block Series (1-4) - Guard (GU 8) | Guillotine Choke (Standing) (GU 23)",
    "Straight Armbar - Mount (GU 9) | Guillotine Defense (GU 32)",
    "Triangle Choke - Gaurd (GU 10) | Haymaker Punch Defense (GU 30)",
    "Elevator Sweep - Gaurd (GU 11) | Rear Takedown (GU 29)",
    "Elbow Escape - Mount (GU 12) | Pull Guard (GU 21)",
    "Position Control - Side Mount (GU 13) | Double Leg Takedown (Aggressive) (GU 17)",
    "Headlock Counters - Mount (GU 16) | Standing Headlock Defense (GU 26)",
    "Headlock Escape 1 - Side Mount (GU 18) | Straight Armbar - Guard (GU 34)",
    "Straight Armbar - Guard (GU 19) | Clinch (Aggressive Opponent) (GU 7)",
    "Double Ankle Sweep - Guard (GU 20) | Guillotine Choke (Gaurd Pull) (GU 23)",
  ],
  "Women Empowered": [],
  "Reflex Developement": [],
  "Jr Grapplers": [],
  "Black Belt Club": [],
  "Private Lesson": [],
  "Group Lesson": [],
  "WE Seminar": [],
  "GC Seminar": [],
  "Gracie Game Day": [],
  "Parent's Day": [],
  "Open Mat": [],
  "Little Champs": [],
};

export default function ClassScheduler() {
  const [classes, setClasses] = useState(initialClasses);
  const [selectedClass, setSelectedClass] = useState<any>("");
  const [selectedLesson, setSelectedLesson] = useState("");
  const [selectedDate, setSelectedDate] = useState<any>(null);
  const [selectedTime, setSelectedTime] = useState<any>(null);
  const [note, setNote] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newClassName, setNewClassName] = useState("");
  const [newLessonName, setNewLessonName] = useState("");
  const [showNewClassInput, setShowNewClassInput] = useState(false);
  const [showNewLessonInput, setShowNewLessonInput] = useState(false);

  const [fadeAnim] = useState(new Animated.Value(0));
  const [step, setStep] = useState(1);

  const { width } = useWindowDimensions();
  const colorScheme = useColorScheme();

  const isFormValid =
    selectedClass && selectedLesson && selectedDate && selectedTime;

  useEffect(() => {
    loadCustomClasses();
  }, []);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [step]);

  const loadCustomClasses = async () => {
    try {
      const customClassesData = await AsyncStorage.getItem("customClasses");
      if (customClassesData) {
        const customClasses = JSON.parse(customClassesData);
        setClasses({ ...initialClasses, ...customClasses });
      }
    } catch (error) {
      console.error("Error loading custom classes:", error);
    }
  };

  const saveCustomClasses = async (updatedClasses: any) => {
    try {
      const customClasses = { ...updatedClasses };
      Object.keys(initialClasses).forEach((key) => {
        delete customClasses[key];
      });
      await AsyncStorage.setItem(
        "customClasses",
        JSON.stringify(customClasses)
      );
    } catch (error) {
      console.error("Error saving custom classes:", error);
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

  const handleSaveClass = async () => {
    setIsSaving(true);
    try {
      const classesData = await AsyncStorage.getItem("classes");
      var currentClasses = classesData ? JSON.parse(classesData) : [];

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

  const handleAddNewClass = () => {
    if (newClassName.trim()) {
      const updatedClasses = { ...classes, [newClassName]: [] };
      setClasses(updatedClasses);
      saveCustomClasses(updatedClasses);
      setSelectedClass(newClassName);
      setNewClassName("");
      setShowNewClassInput(false);
      setStep(Math.max(step, 2));
    }
  };

  const handleAddNewLesson = () => {
    if (newLessonName.trim() && selectedClass) {
      const updatedClasses = {
        ...classes,
        [selectedClass]: [...classes[selectedClass], newLessonName],
      };
      setClasses(updatedClasses);
      saveCustomClasses(updatedClasses);
      setSelectedLesson(newLessonName);
      setNewLessonName("");
      setShowNewLessonInput(false);
      setStep(Math.max(step, 3));
    }
  };

  const handleDeleteClass = (className: string) => {
    Alert.alert(
      "Delete Class",
      `Are you sure you want to delete "${className}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setClasses((prevClasses: any) => {
              const updatedClasses = { ...prevClasses };
              delete updatedClasses[className];
              saveCustomClasses(updatedClasses);
              return updatedClasses;
            });
            if (selectedClass === className) {
              setSelectedClass("");
              setSelectedLesson("");
            }
          },
        },
      ]
    );
  };

  const handleDeleteLesson = (lesson: string) => {
    Alert.alert(
      "Delete Lesson",
      `Are you sure you want to delete "${lesson}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            const updatedClasses = {
              ...classes,
              [selectedClass]: classes[selectedClass].filter(
                (l: string) => l !== lesson
              ),
            };
            setClasses(updatedClasses);
            saveCustomClasses(updatedClasses);
            if (selectedLesson === lesson) {
              setSelectedLesson("");
            }
          },
        },
      ]
    );
  };

  const renderStep = (currentStep: number) => {
    if (currentStep > step) return null;

    return (
      <Animated.View
        style={[
          styles.stepContainer,
          { opacity: currentStep === step ? fadeAnim : 1 },
        ]}
      >
        {currentStep === 1 && (
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedClass}
              onValueChange={(itemValue) => {
                setSelectedClass(itemValue);
                setSelectedLesson("");
                setStep(Math.max(step, 2));
              }}
              style={styles.picker}
            >
              <Picker.Item label="Select a class" value="" />
              {Object.keys(classes).map((className) => (
                <Picker.Item
                  key={className}
                  label={className}
                  value={className}
                />
              ))}
              <Picker.Item label="Add new class" value="add_new_class" />
            </Picker>
            {selectedClass === "add_new_class" && (
              <View style={styles.newItemContainer}>
                <TextInput
                  style={[styles.input, { margin: 10, width: "80%" }]}
                  value={newClassName}
                  onChangeText={setNewClassName}
                  placeholder="Enter new class name"
                />
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={handleAddNewClass}
                >
                  <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>
              </View>
            )}
            {selectedClass &&
              !originalClasses[selectedClass] &&
              selectedClass !== "add_new_class" && (
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteClass(selectedClass)}
                >
                  <Text style={styles.deleteButtonText}>Delete Class</Text>
                </TouchableOpacity>
              )}
          </View>
        )}

        {currentStep === 2 &&
          selectedClass &&
          selectedClass !== "add_new_class" && (
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedLesson}
                onValueChange={(itemValue) => {
                  setSelectedLesson(itemValue);
                  setStep(Math.max(step, 3));
                }}
                style={styles.picker}
              >
                <Picker.Item label="Select a lesson" value="" />
                {classes[selectedClass] &&
                  classes[selectedClass].map((lesson: string) => (
                    <Picker.Item key={lesson} label={lesson} value={lesson} />
                  ))}
                <Picker.Item label="Add new lesson" value="add_new_lesson" />
              </Picker>
              {selectedLesson === "add_new_lesson" && (
                <View style={styles.newItemContainer}>
                  <TextInput
                    style={[styles.input, { margin: 10, width: "80%" }]}
                    value={newLessonName}
                    onChangeText={setNewLessonName}
                    placeholder="Enter new lesson name"
                  />
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={handleAddNewLesson}
                  >
                    <Text style={styles.addButtonText}>Add</Text>
                  </TouchableOpacity>
                </View>
              )}
              {selectedLesson &&
                selectedClass &&
                !originalClasses?.[selectedClass]?.includes(selectedLesson) &&
                selectedLesson !== "add_new_lesson" && (
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteLesson(selectedLesson)}
                  >
                    <Text style={styles.deleteButtonText}>Delete Lesson</Text>
                  </TouchableOpacity>
                )}
            </View>
          )}

        {currentStep === 3 && (
          <View style={[styles.dateTimeContainer, width > 500 && styles.row]}>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={[styles.dateButton, width > 500 && styles.flex1]}
            >
              <Text style={styles.dateButtonText}>
                {selectedDate ? selectedDate.toDateString() : "Select Date"}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={selectedDate || new Date()}
                mode="date"
                display="default"
                onChange={(event, date: any) => {
                  setShowDatePicker(false);
                  if (date) {
                    setSelectedDate(date);
                    setStep(Math.max(step, 4));
                  }
                }}
              />
            )}

            <TouchableOpacity
              onPress={() => setShowTimePicker(true)}
              style={[styles.dateButton, width > 500 && styles.flex1]}
            >
              <Text style={styles.dateButtonText}>
                {selectedTime
                  ? selectedTime.toLocaleTimeString()
                  : "Select Time"}
              </Text>
            </TouchableOpacity>

            {showTimePicker && (
              <DateTimePicker
                value={selectedTime || new Date()}
                mode="time"
                display="default"
                onChange={(event, time: any) => {
                  setShowTimePicker(false);
                  if (time) {
                    setSelectedTime(time);
                    setStep(Math.max(step, 5));
                  }
                }}
              />
            )}
          </View>
        )}

        {currentStep === 4 && selectedDate && selectedTime && (
          <TextInput
            style={styles.input}
            onChangeText={setNote}
            value={note}
            placeholder="Add a note (optional)"
            multiline
            textAlignVertical="top"
          />
        )}
      </Animated.View>
    );
  };

  const theme = {
    backgroundColor: colorScheme === "dark" ? "#121212" : "#f0f8ff",
    textColor: colorScheme === "dark" ? "#ffffff" : "#000000",
    primaryColor: colorScheme === "dark" ? "#bb86fc" : "#1e90ff",
    secondaryColor: colorScheme === "dark" ? "#3700b3" : "#b0c4de",
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.backgroundColor }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.title, { color: theme.primaryColor }]}>
          Save a Class
        </Text>
        {[1, 2, 3, 4].map((s) => (
          <React.Fragment key={`step-${s}`}>{renderStep(s)}</React.Fragment>
        ))}
      </ScrollView>
      <View
        style={[
          styles.bottomContainer,
          { backgroundColor: theme.backgroundColor },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.saveButton,
            { backgroundColor: theme.primaryColor },
            (!isFormValid || isSaving) && {
              backgroundColor: theme.secondaryColor,
            },
          ]}
          onPress={handleSaveClass}
          disabled={!isFormValid || isSaving}
        >
          <Text style={styles.saveButtonText}>
            {isSaving ? "Saving..." : "Save Class"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 50,
    paddingBottom: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  stepContainer: {
    marginBottom: 30,
  },
  pickerContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 20,
    width: "100%",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#1e90ff",
  },
  picker: {
    height: "auto",
    width: "100%",
  },
  dateTimeContainer: {
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  flex1: {
    flex: 1,
    marginHorizontal: 5,
  },
  dateButton: {
    backgroundColor: "#1e90ff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    width: "100%",
  },
  dateButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
  input: {
    height: 100,
    borderColor: "#1e90ff",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    padding: 10,
    width: "100%",
    backgroundColor: "#fff",
    textAlignVertical: "top",
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  saveButton: {
    padding: 15,
    borderRadius: 10,
    width: "100%",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
  },
  newItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  addButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "#f44336",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
