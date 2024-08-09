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
  const [refreshing, setRefreshing] = useState(false);
  const theme = useTheme();

  const navigation: any = useNavigation();

  const loadData = useCallback(async () => {
    const fetchedClasses = await loadCustomClasses();
    const fetchedClassLogs = await fetchClassLogs();
    setClasses([...initialClasses, ...fetchedClasses]);
    setClassLogs(fetchedClassLogs);
  }, []);

  const handleEditClassLogSave = async () => {
    await loadData();
  };

  const handleEditClassLog = (classLog: ClassLog) => {
    navigation.navigate("EditClassLog", {
      classLog,
      onSave: handleEditClassLogSave,
    });
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
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
