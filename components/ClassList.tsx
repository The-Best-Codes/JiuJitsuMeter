import React from "react";
import { View, ScrollView, Alert } from "react-native";
import { Card, Title, Paragraph, IconButton } from "react-native-paper";
import { ClassItem } from "@/types";
import { formatDate, formatTime, formatMDY } from "@/utils/dateUtils";
import { useTheme } from "@/styles/theme";

interface Props {
  classes: ClassItem[];
  onDeleteClass: (id: string) => void;
  onEditClass: (classItem: ClassItem) => void; // Add this line
}

const ClassList: React.FC<Props> = ({ classes, onDeleteClass, onEditClass }) => {
  const theme = useTheme();

  const confirmDelete = (id: string, className: string) => {
    Alert.alert(
      "Delete Class",
      `Are you sure you want to delete "${className}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => onDeleteClass(id),
          style: "destructive",
        },
      ],
      { cancelable: false }
    );
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
      {classes.map((classItem, index) => (
        <Card
          key={classItem.id}
          style={{
            marginBottom: index !== classes.length - 1 ? 64 : 32,
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
                {`${classItem.selectedClass}`} &middot;{" "}
                {`${classItem.selectedLesson}`}
              </Title>
              <View style={{ flexDirection: "row" }}>
                <IconButton
                  icon="pencil"
                  onPress={() => onEditClass(classItem)}
                  style={{
                    marginTop: -8,
                    marginRight: 8,
                    backgroundColor: theme.colors.primary,
                  }}
                />
                <IconButton
                  icon="delete"
                  onPress={() =>
                    confirmDelete(
                      classItem.id,
                      `${classItem.selectedClass} - ${classItem.selectedLesson}`
                    )
                  }
                  style={{
                    marginTop: -8,
                    marginRight: -8,
                    backgroundColor: theme.colors.error,
                  }}
                />
              </View>
            </View>
            <Paragraph
              style={{ color: theme.colors.onBackground, marginBottom: 8 }}
            >
              {`${formatDate(classItem.selectedDate)} at ${formatTime(
                classItem.selectedTime
              )} · ${formatMDY(classItem.selectedDate)}`}
            </Paragraph>
            {classItem.note && (
              <Paragraph style={{ color: theme.colors.onBackground }}>
                {classItem.note}
              </Paragraph>
            )}
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
  );
};

export default ClassList;
