import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import {
  loadCustomClasses,
  addCustomClass,
  editCustomClass,
  deleteCustomClass,
  addCustomLesson,
  editCustomLesson,
  deleteCustomLesson,
} from "@/utils/storage";
import { Class, Lesson } from "@/types";

export default function ClassesScreen() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [newClassName, setNewClassName] = useState("");
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [newLessonName, setNewLessonName] = useState("");

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    const loadedClasses = await loadCustomClasses();
    setClasses(loadedClasses);
  };

  const handleAddClass = async () => {
    if (newClassName.trim()) {
      await addCustomClass(newClassName);
      setNewClassName("");
      loadClasses();
    }
  };

  const handleEditClass = async (classId: string, newName: string) => {
    await editCustomClass(classId, newName);
    setEditingClass(null);
    loadClasses();
  };

  const handleDeleteClass = async (classId: string) => {
    Alert.alert("Delete Class", "Are you sure you want to delete this class?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteCustomClass(classId);
          loadClasses();
        },
      },
    ]);
  };

  const handleAddLesson = async (classId: string) => {
    if (newLessonName.trim()) {
      await addCustomLesson(classId, newLessonName);
      setNewLessonName("");
      loadClasses();
    }
  };

  const handleEditLesson = async (
    classId: string,
    lessonId: string,
    newName: string
  ) => {
    await editCustomLesson(classId, lessonId, newName);
    loadClasses();
  };

  const handleDeleteLesson = async (classId: string, lessonId: string) => {
    Alert.alert(
      "Delete Lesson",
      "Are you sure you want to delete this lesson?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteCustomLesson(classId, lessonId);
            loadClasses();
          },
        },
      ]
    );
  };

  const renderClass = ({ item: classItem }: { item: Class }) => (
    <View style={styles.classItem}>
      {editingClass?.id === classItem.id ? (
        <TextInput
          value={editingClass.class}
          onChangeText={(text) =>
            setEditingClass({ ...editingClass, class: text })
          }
          onBlur={() => handleEditClass(classItem.id, editingClass.class)}
          style={styles.input}
        />
      ) : (
        <Text style={styles.className}>{classItem.class}</Text>
      )}
      <TouchableOpacity onPress={() => setEditingClass(classItem)}>
        <Text style={styles.editButton}>Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleDeleteClass(classItem.id)}>
        <Text style={styles.deleteButton}>Delete</Text>
      </TouchableOpacity>
      <FlatList
        data={classItem.data}
        renderItem={({ item: lesson }) => renderLesson(classItem.id, lesson)}
        keyExtractor={(item) => item.id}
      />
      <View style={styles.addLessonContainer}>
        <TextInput
          placeholder="New lesson name"
          value={newLessonName}
          onChangeText={setNewLessonName}
          style={styles.input}
        />
        <TouchableOpacity onPress={() => handleAddLesson(classItem.id)}>
          <Text style={styles.addButton}>Add Lesson</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderLesson = (classId: string, lesson: Lesson) => (
    <View style={styles.lessonItem}>
      <TextInput
        value={lesson.name}
        onChangeText={(text) => handleEditLesson(classId, lesson.id, text)}
        style={styles.input}
      />
      <TouchableOpacity onPress={() => handleDeleteLesson(classId, lesson.id)}>
        <Text style={styles.deleteButton}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.addClassContainer}>
        <TextInput
          placeholder="New class name"
          value={newClassName}
          onChangeText={setNewClassName}
          style={styles.input}
        />
        <TouchableOpacity onPress={handleAddClass}>
          <Text style={styles.addButton}>Add Class</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={classes}
        renderItem={renderClass}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  addClassContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginRight: 10,
  },
  addButton: {
    color: "blue",
    fontSize: 16,
  },
  classItem: {
    marginBottom: 20,
  },
  className: {
    fontSize: 18,
    fontWeight: "bold",
  },
  editButton: {
    color: "green",
  },
  deleteButton: {
    color: "red",
  },
  lessonItem: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  addLessonContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
});
