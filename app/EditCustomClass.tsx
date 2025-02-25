import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  RefreshControl,
  StyleSheet,
  // Alert,
} from "react-native";
import {
  List,
  IconButton,
  Button,
  TextInput,
  FAB,
  Dialog,
  Portal,
  Paragraph,
  Text,
  Provider as PaperProvider,
} from "react-native-paper";
import { useTheme } from "@/styles/theme";
import { useNavigation } from "@react-navigation/native";
import {
  loadCustomClasses,
  addCustomClass,
  editCustomClass,
  deleteCustomClass,
  addCustomLesson,
  editCustomLesson,
  deleteCustomLesson,
  //resetClasses,
} from "@/utils/storage";
import { Class, Lesson } from "@/types";
import { initialClasses } from "@/utils/constants";
import i18n from "@/i18n";

const ClassesScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(true);
  const [classes, setClasses] = useState<Class[]>(initialClasses);
  const [isAddingClass, setIsAddingClass] = useState(false);
  const [newClassName, setNewClassName] = useState("");
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [isAddingLesson, setIsAddingLesson] = useState<any>(false);
  const [newLessonName, setNewLessonName] = useState("");
  const [editingLesson, setEditingLesson] = useState<{
    classId: string;
    lesson: Lesson;
  } | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    type: "class" | "lesson";
    id: string;
    classId?: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadClasses();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      title: "Edit Custom Classes",
    });
  }, [navigation]);

  const loadClasses = async () => {
    setRefreshing(true);
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
    setRefreshing(false);
  };

  const isNameUnique = (
    name: string,
    type: "class" | "lesson",
    classId?: string
  ) => {
    if (type === "class") {
      return !classes.some((c) => c.class.toLowerCase() === name.toLowerCase());
    } else if (type === "lesson" && classId) {
      const targetClass = classes.find((c) => c.id === classId);
      return !targetClass?.data.some(
        (l) => l.name.toLowerCase() === name.toLowerCase()
      );
    }
    return true;
  };

  /* const confirmResetAllClasses = () => {
    Alert.alert(
      i18n.t("classes.resetAllClasses"),
      i18n.t("classes.resetAllClassesConfirm"),
      [
        {
          text: i18n.t("confirmations.cancel"),
          style: "cancel",
        },
        {
          text: i18n.t("confirmations.yes"),
          style: "destructive",
          onPress: async () => {
            await resetClasses();
            loadClasses();
          },
        },
      ]
    );
  }; */

  const handleAddClass = async () => {
    if (!newClassName.trim()) {
      setError(i18n.t("classes.classEmptyError"));
      return;
    }
    if (!isNameUnique(newClassName, "class")) {
      setError(i18n.t("classes.classSameNameError"));
      return;
    }
    await addCustomClass(newClassName);
    setNewClassName("");
    setIsAddingClass(false);
    setError(null);
    loadClasses();
  };

  const handleEditClass = async () => {
    if (editingClass && newClassName.trim()) {
      if (!isNameUnique(newClassName, "class")) {
        setError(i18n.t("classes.classSameNameError"));
        return;
      }
      await editCustomClass(editingClass.id, newClassName);
      setEditingClass(null);
      setNewClassName("");
      setError(null);
      loadClasses();
    }
  };

  const handleDeleteClass = async () => {
    if (deleteConfirmation && deleteConfirmation.type === "class") {
      await deleteCustomClass(deleteConfirmation.id);
      setDeleteConfirmation(null);
      loadClasses();
    }
  };

  const handleAddLesson = async () => {
    if (isAddingLesson && newLessonName.trim()) {
      if (!isNameUnique(newLessonName, "lesson", isAddingLesson as any)) {
        setError(i18n.t("lessons.lessonSameNameError"));
        return;
      }
      await addCustomLesson(isAddingLesson as any, newLessonName);
      setNewLessonName("");
      setIsAddingLesson(false);
      setError(null);
      loadClasses();
    }
  };

  const handleEditLesson = async () => {
    if (editingLesson && newLessonName.trim()) {
      if (!isNameUnique(newLessonName, "lesson", editingLesson.classId)) {
        setError(i18n.t("lessons.lessonSameNameError"));
        return;
      }
      await editCustomLesson(
        editingLesson.classId,
        editingLesson.lesson.id,
        newLessonName
      );
      setEditingLesson(null);
      setNewLessonName("");
      setError(null);
      loadClasses();
    }
  };

  const handleDeleteLesson = async () => {
    if (
      deleteConfirmation &&
      deleteConfirmation.type === "lesson" &&
      deleteConfirmation.classId
    ) {
      await deleteCustomLesson(
        deleteConfirmation.classId,
        deleteConfirmation.id
      );
      setDeleteConfirmation(null);
      loadClasses();
    }
  };

  const isCustomClass = (classId: string) => {
    return !initialClasses.some((c: Class) => c.id === classId);
  };

  const isCustomLesson = (classId: string, lessonId: string) => {
    // Check if initialClasses contains the class
    const initialClass: Class = initialClasses.find(
      (c: Class) => c.id === classId
    );

    if (!initialClass) {
      return true;
    }

    // Check if the initialClass contains the lesson
    const lessonExists = initialClass.data.some(
      (lesson: Lesson) => lesson.id === lessonId
    );
    if (!lessonExists) {
      return true;
    }

    return false;
  };

  return (
    <PaperProvider theme={theme}>
      <View style={styles.container}>
        <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>
          Manage Custom Classes
        </Text>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={loadClasses} />
          }
        >
          {classes.map((classItem) => (
            <List.Accordion
              key={classItem.id}
              title={classItem.class}
              left={(props) => <List.Icon {...props} icon="folder" />}
            >
              {classItem.data.map((lesson: Lesson) => (
                <List.Item
                  key={`${classItem.id}:${lesson.id}`}
                  title={lesson.name}
                  style={{ backgroundColor: theme.colors.background }}
                  left={(props) => <List.Icon {...props} icon="book" />}
                  right={() => (
                    <View style={[styles.lessonActions]}>
                      {isCustomLesson(classItem.id, lesson.id) && (
                        <React.Fragment>
                          <IconButton
                            icon={"pencil"}
                            mode="contained"
                            onPress={() => {
                              setEditingLesson({
                                classId: classItem.id,
                                lesson,
                              });
                              setNewLessonName(lesson.name);
                            }}
                          ></IconButton>
                          <IconButton
                            icon={"delete"}
                            mode="contained"
                            onPress={() =>
                              setDeleteConfirmation({
                                type: "lesson",
                                id: lesson.id,
                                classId: classItem.id,
                              })
                            }
                          ></IconButton>
                        </React.Fragment>
                      )}
                    </View>
                  )}
                />
              ))}
              <View
                style={[
                  styles.classActions,
                  {
                    marginTop: 0,
                    paddingTop: 16,
                    paddingBottom: 32,
                    backgroundColor: theme.colors.background,
                  },
                ]}
              >
                <Button
                  icon={"plus"}
                  mode="contained"
                  onPress={() => setIsAddingLesson(classItem.id)}
                >
                  {i18n.t("actions.add")}
                </Button>
                {isCustomClass(classItem.id) && (
                  <>
                    <Button
                      icon={"pencil"}
                      mode="contained"
                      onPress={() => {
                        setEditingClass(classItem);
                        setNewClassName(classItem.class);
                      }}
                    >
                      {i18n.t("actions.edit")}
                    </Button>
                    <Button
                      icon={"delete"}
                      mode="contained"
                      onPress={() =>
                        setDeleteConfirmation({
                          type: "class",
                          id: classItem.id,
                        })
                      }
                    >
                      {i18n.t("actions.delete")}
                    </Button>
                  </>
                )}
              </View>
            </List.Accordion>
          ))}
          {/* <Button
            icon={"refresh"}
            mode="contained"
            onPress={() => confirmResetAllClasses()}
            style={{ marginVertical: 32, backgroundColor: theme.colors.error }}
          >
            Reset All Classes
          </Button> */}
        </ScrollView>

        <FAB
          style={styles.fab}
          icon="plus"
          onPress={() => setIsAddingClass(true)}
        />

        <Portal>
          <Dialog
            visible={isAddingClass}
            onDismiss={() => {
              setIsAddingClass(false);
              setError(null);
            }}
          >
            <Dialog.Title>Add New Class</Dialog.Title>
            <Dialog.Content>
              <TextInput
                label="Class Name"
                value={newClassName}
                onChangeText={setNewClassName}
              />
              {error && <Paragraph style={styles.error}>{error}</Paragraph>}
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                onPress={() => {
                  setIsAddingClass(false);
                  setError(null);
                }}
              >
                {i18n.t("confirmations.cancel")}
              </Button>
              <Button onPress={handleAddClass}>{i18n.t("actions.add")}</Button>
            </Dialog.Actions>
          </Dialog>

          <Dialog
            visible={!!editingClass}
            onDismiss={() => {
              setEditingClass(null);
              setError(null);
            }}
          >
            <Dialog.Title>Edit Class</Dialog.Title>
            <Dialog.Content>
              <TextInput
                label="Class Name"
                value={newClassName}
                onChangeText={setNewClassName}
              />
              {error && <Paragraph style={styles.error}>{error}</Paragraph>}
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                onPress={() => {
                  setEditingClass(null);
                  setError(null);
                }}
              >
                {i18n.t("confirmations.cancel")}
              </Button>
              <Button onPress={handleEditClass}>
                {i18n.t("actions.save")}
              </Button>
            </Dialog.Actions>
          </Dialog>

          <Dialog
            visible={!!isAddingLesson}
            onDismiss={() => {
              setIsAddingLesson(false);
              setError(null);
            }}
          >
            <Dialog.Title>Add New Lesson</Dialog.Title>
            <Dialog.Content>
              <TextInput
                label="Lesson Name"
                value={newLessonName}
                onChangeText={setNewLessonName}
              />
              {error && <Paragraph style={styles.error}>{error}</Paragraph>}
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                onPress={() => {
                  setIsAddingLesson(false);
                  setError(null);
                }}
              >
                {i18n.t("confirmations.cancel")}
              </Button>
              <Button onPress={handleAddLesson}>{i18n.t("actions.add")}</Button>
            </Dialog.Actions>
          </Dialog>

          <Dialog
            visible={!!editingLesson}
            onDismiss={() => {
              setEditingLesson(null);
              setError(null);
            }}
          >
            <Dialog.Title>Edit Lesson</Dialog.Title>
            <Dialog.Content>
              <TextInput
                label="Lesson Name"
                value={newLessonName}
                onChangeText={setNewLessonName}
              />
              {error && <Paragraph style={styles.error}>{error}</Paragraph>}
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                onPress={() => {
                  setEditingLesson(null);
                  setError(null);
                }}
              >
                {i18n.t("confirmations.cancel")}
              </Button>
              <Button onPress={handleEditLesson}>
                {i18n.t("actions.save")}
              </Button>
            </Dialog.Actions>
          </Dialog>

          <Dialog
            visible={!!deleteConfirmation}
            onDismiss={() => setDeleteConfirmation(null)}
          >
            <Dialog.Title>Confirm Deletion</Dialog.Title>
            <Dialog.Content>
              <Paragraph>
                Are you sure you want to delete this {deleteConfirmation?.type}?
              </Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setDeleteConfirmation(null)}>
                {i18n.t("confirmations.cancel")}
              </Button>
              <Button
                onPress={
                  deleteConfirmation?.type === "class"
                    ? handleDeleteClass
                    : handleDeleteLesson
                }
              >
                {i18n.t("actions.delete")}
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
  lessonActions: {
    flexDirection: "row",
  },
  classActions: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-around",
    marginTop: 8,
  },
  error: {
    color: "red",
    marginTop: 8,
  },
});

export default ClassesScreen;
