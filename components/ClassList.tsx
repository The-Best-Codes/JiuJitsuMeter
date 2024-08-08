import React from "react";
import { View, ScrollView, Alert } from "react-native";
import { Card, Title, Paragraph, IconButton } from "react-native-paper";
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

  const confirmDelete = (id: string, className: string, lessonName: string) => {
    Alert.alert(
      "Delete Class Log",
      `Are you sure you want to delete "${className} - ${lessonName}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => onDeleteClassLog(id),
          style: "destructive",
        },
      ],
      { cancelable: false }
    );
  };

  const getClassAndLessonNames = (classId: string, lessonId: string) => {
    const classItem = classes.find((c) => c.id === classId);
    if (!classItem) return { className: "Unknown", lessonName: "Unknown" };

    const lesson = classItem.data.find((l) => l.id === lessonId);
    return {
      className: classItem.class,
      lessonName: lesson ? lesson.name : "Unknown",
    };
  };

  return (
    <ScrollView>
      <Title
        style={{
          color: theme.colors.onBackground,
          fontWeight: "bold",
          marginBottom: 16,
        }}
      >
        Your Classes
      </Title>
      {classLogs &&
        classLogs.length > 0 &&
        classLogs.map((classLog, index) => {
          const { className, lessonName } = getClassAndLessonNames(
            classLog.classId,
            classLog.lessonId
          );
          return (
            <Card
              key={classLog.id}
              style={{
                marginBottom: index !== classLogs.length - 1 ? 16 : 32,
                backgroundColor: theme.colors.secondaryContainer,
              }}
            >
              <Card.Content>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <Title
                    numberOfLines={2}
                    style={{
                      color: theme.colors.onBackground,
                      flex: 1,
                      marginRight: 8,
                    }}
                  >
                    {`${className}`} &middot; {`${lessonName}`}
                  </Title>
                  <View style={{ flexDirection: "row" }}>
                    <IconButton
                      icon="pencil"
                      iconColor={theme.colors.onPrimary}
                      onPress={() => onEditClassLog(classLog)}
                      style={{
                        marginTop: -4,
                        marginRight: 4,
                        backgroundColor: theme.colors.primary,
                      }}
                    />
                    <IconButton
                      icon="delete"
                      iconColor={theme.colors.onError}
                      onPress={() =>
                        confirmDelete(classLog.id, className, lessonName)
                      }
                      style={{
                        marginTop: -4,
                        marginRight: -4,
                        backgroundColor: theme.colors.error,
                      }}
                    />
                  </View>
                </View>
                <Paragraph
                  style={{ color: theme.colors.onBackground, marginBottom: 8 }}
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
        })}
    </ScrollView>
  );
};

export default ClassList;
