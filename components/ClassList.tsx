import React, { useState, useMemo } from "react";
import { View, ScrollView, Alert, StyleSheet } from "react-native";
import {
  Card,
  Paragraph,
  IconButton,
  Searchbar,
  Button,
  Divider,
  Text,
  Provider as PaperProvider,
} from "react-native-paper";
import ExpandableText from "@/components/ExpandableText";
import { ClassLog, Class } from "@/types";
import { formatDate, formatTime, formatMDY } from "@/utils/dateUtils";
import { useTheme } from "@/styles/theme";

interface Props {
  classes: Class[];
  classLogs: ClassLog[];
  onDeleteClassLog: (id: string) => void;
  onEditClassLog: (classLog: ClassLog) => void;
}

const ClassList: React.FC<Props> = ({
  classes,
  classLogs,
  onDeleteClassLog,
  onEditClassLog,
}) => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  const getClassAndLessonNames = (classId: string, lessonId: string) => {
    try {
      const classItem = classes.find((c) => c.id === classId);
      if (!classItem) return { className: "Unknown", lessonName: "Unknown" };

      const lesson = classItem.data?.find((l) => l.id === lessonId);
      return {
        className: classItem.class || "Unknown",
        lessonName: lesson?.name || "Unknown",
      };
    } catch (error) {
      console.error("Error in getClassAndLessonNames:", error);
      return { className: "Unknown", lessonName: "Unknown" };
    }
  };

  const filteredAndSortedLogs = useMemo(() => {
    try {
      return classLogs
        .filter((log) => {
          try {
            const { className, lessonName } = getClassAndLessonNames(
              log.classId,
              log.lessonId
            );
            const searchString = `${className} ${lessonName} ${
              log.note || ""
            } ${formatDate(log.date as any)} ${formatTime(
              log.time as any
            )}`.toLowerCase();
            return searchString.includes(searchQuery.toLowerCase());
          } catch (error) {
            console.error("Error filtering log:", error);
            return false;
          }
        })
        .sort((a, b) => {
          try {
            if (sortBy === "date") {
              return sortOrder === "asc"
                ? new Date(a.date as any).getTime() -
                    new Date(b.date as any).getTime()
                : new Date(b.date as any).getTime() -
                    new Date(a.date as any).getTime();
            } else if (sortBy === "class") {
              const classA = getClassAndLessonNames(
                a.classId,
                a.lessonId
              ).className;
              const classB = getClassAndLessonNames(
                b.classId,
                b.lessonId
              ).className;
              return sortOrder === "asc"
                ? classA.localeCompare(classB)
                : classB.localeCompare(classA);
            }
            return 0;
          } catch (error) {
            console.error("Error sorting logs:", error);
            return 0;
          }
        });
    } catch (error) {
      console.error("Error in filteredAndSortedLogs:", error);
      return [];
    }
  }, [classLogs, searchQuery, sortBy, sortOrder]);

  const confirmDelete = (id: string, className: string, lessonName: string) => {
    Alert.alert(
      "Delete Class Log",
      `Are you sure you want to delete "${className} - ${lessonName}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: () => onDeleteClassLog(id),
          style: "destructive",
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <PaperProvider theme={theme}>
      <Divider style={{ marginTop: 64, marginBottom: 16 }} />
      <View style={styles.container}>
        <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 32 }}>
          Class Logs
        </Text>
        <Searchbar
          placeholder="Search classes"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
        <View style={styles.sortContainer}>
          <Button
            onPress={() => setSortBy(sortBy === "class" ? "date" : "class")}
            icon="sort"
            style={{ borderColor: theme.colors.primary, borderWidth: 1 }}
          >
            Sort by: {sortBy}
          </Button>

          <IconButton
            icon={sortOrder === "asc" ? "sort-ascending" : "sort-descending"}
            onPress={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            mode="contained"
          />
        </View>
        <ScrollView>
          {filteredAndSortedLogs.map((classLog, index) => {
            try {
              const { className, lessonName } = getClassAndLessonNames(
                classLog.classId,
                classLog.lessonId
              );
              return (
                <Card
                  key={classLog.id}
                  style={[
                    styles.card,
                    { backgroundColor: theme.colors.secondaryContainer },
                    index !== filteredAndSortedLogs.length - 1 &&
                      styles.cardMargin,
                  ]}
                >
                  <Card.Content>
                    <View style={styles.cardHeader}>
                      <View style={styles.titleContainer}>
                        <ExpandableText
                          text={`${className} · ${lessonName}`}
                          maxLines={2}
                          style={[
                            styles.cardTitle,
                            { color: theme.colors.onBackground },
                          ]}
                        />
                      </View>
                      <View style={styles.cardActions}>
                        <IconButton
                          icon="pencil"
                          iconColor={theme.colors.onPrimary}
                          onPress={() => onEditClassLog(classLog)}
                          style={[
                            styles.actionButton,
                            { backgroundColor: theme.colors.primary },
                          ]}
                        />
                        <IconButton
                          icon="delete"
                          iconColor={theme.colors.onError}
                          onPress={() =>
                            confirmDelete(classLog.id, className, lessonName)
                          }
                          style={[
                            styles.actionButton,
                            { backgroundColor: theme.colors.error },
                          ]}
                        />
                      </View>
                    </View>
                    <Paragraph
                      style={[
                        styles.dateTime,
                        { color: theme.colors.onBackground },
                      ]}
                    >
                      {`${formatDate(classLog.date as any)} at ${formatTime(
                        classLog.time as any
                      )} · ${formatMDY(classLog.date as any)}`}
                    </Paragraph>
                    {classLog.note && (
                      <Paragraph style={{ color: theme.colors.onBackground }}>
                        {classLog.note}
                      </Paragraph>
                    )}
                  </Card.Content>
                </Card>
              );
            } catch (error) {
              console.error("Error rendering class log:", error);
              return null;
            }
          })}
        </ScrollView>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchBar: {
    marginBottom: 16,
  },
  sortContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  card: {
    marginBottom: 16,
  },
  cardMargin: {
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  cardActions: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  actionButton: {
    marginTop: -4,
    marginRight: 4,
  },
  dateTime: {
    marginBottom: 8,
  },
});

export default ClassList;
