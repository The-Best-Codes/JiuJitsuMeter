import React, { useState, useEffect, useCallback } from "react";
import { RefreshControl, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@/styles/theme";
import ClassDistribution from "@/components/ClassDistribution";
import LessonDistribution from "@/components/LessonDistribution";
import TimeDistribution from "@/components/TimeDistribution";
import ClassList from "@/components/ClassList";
import { fetchClasses, deleteClass } from "@/utils/storage";
import { ClassItem } from "@/types";

const ExplorePage: React.FC = () => {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const theme = useTheme();

  const navigation: any = useNavigation();

  const loadClasses = useCallback(async () => {
    const fetchedClasses = await fetchClasses();
    setClasses(fetchedClasses);
  }, []);

  const handleEditClassSave = async () => {
    await loadClasses();
    console.log("Class updated successfully (callback function)");
    navigation.goBack();
  };

  const handleEditClass = (classItem: ClassItem) => {
    navigation.navigate("EditClass", {
      classItem,
    });
    navigation.setOptions({
      onSave: handleEditClassSave,
    });
  };

  useEffect(() => {
    loadClasses();
  }, [loadClasses]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadClasses();
    setRefreshing(false);
  }, [loadClasses]);

  const handleDeleteClass = useCallback(
    async (id: string) => {
      await deleteClass(id);
      await loadClasses();
    },
    [loadClasses]
  );

  return (
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
      <ClassDistribution classes={classes} />
      <LessonDistribution classes={classes} />
      <TimeDistribution classes={classes} />
      <ClassList
        classes={classes}
        onDeleteClass={handleDeleteClass}
        onEditClass={handleEditClass}
      />
    </ScrollView>
  );
};

export default ExplorePage;
