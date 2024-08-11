import React, { useState, useEffect, useCallback } from "react";
import { RefreshControl, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@/styles/theme";
import { initialClasses } from "@/utils/constants";
import ClassDistribution from "@/components/ClassDistribution";
import LessonDistribution from "@/components/LessonDistribution";
import TimeDistribution from "@/components/TimeDistribution";
import ClassList from "@/components/ClassList";
import { Class, ClassLog } from "@/types";
import {
  loadCustomClasses,
  fetchClassLogs,
  deleteClassLog,
} from "@/utils/storage";
import { Divider, Provider as PaperProvider } from "react-native-paper";

const ExplorePage: React.FC = () => {
  const [classes, setClasses] = useState<Class[]>(initialClasses);
  const [classLogs, setClassLogs] = useState<ClassLog[]>([]);
  const [refreshing, setRefreshing] = useState(true);
  const theme = useTheme();

  const navigation: any = useNavigation();

  const loadData = useCallback(async () => {
    await loadClasses();
    const fetchedClassLogs = await fetchClassLogs();
    setClassLogs(fetchedClassLogs);
  }, []);

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

  const handleEditClassLogSave = useCallback(async () => {
    await loadData();
  }, [loadData]);

  const handleEditClassLog = useCallback(
    (classLog: ClassLog) => {
      navigation.navigate("EditClassLog", { classLog });
      navigation.setParams({ onSave: handleEditClassLogSave });
    },
    [navigation, handleEditClassLogSave]
  );

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(async () => {
    await loadData();
  }, [loadData]);

  const handleDeleteClassLog = useCallback(
    async (id: string) => {
      await deleteClassLog(id);
      await loadData();
    },
    [loadData]
  );

  return (
    <PaperProvider theme={theme}>
      <ScrollView
        style={{
          backgroundColor: theme.colors.background,
          padding: 20,
          marginTop: 16,
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <ClassDistribution classLogs={classLogs} classes={classes} />
        <Divider style={{ marginVertical: 20 }} />
        <LessonDistribution classLogs={classLogs} classes={classes} />
        <Divider style={{ marginVertical: 20 }} />
        <TimeDistribution classLogs={classLogs} />
        <ClassList
          classes={classes}
          classLogs={classLogs}
          onDeleteClassLog={handleDeleteClassLog}
          onEditClassLog={handleEditClassLog}
        />
      </ScrollView>
    </PaperProvider>
  );
};

export default ExplorePage;
