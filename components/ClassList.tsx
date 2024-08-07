import React from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { Card, Title, Paragraph, IconButton } from "react-native-paper";
import { ClassItem } from "@/types";
import { formatDate, formatTime, formatMDY } from "@/utils/dateUtils";

interface Props {
  classes: ClassItem[];
  onDeleteClass: (id: string) => void;
}

const ClassList: React.FC<Props> = ({ classes, onDeleteClass }) => {
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
    <ScrollView style={styles.container}>
      <Title style={styles.title}>Your Classes</Title>
      {classes.map((classItem, index) => (
        <Card
          key={classItem.id}
          style={[styles.card, index === classes.length - 1 && styles.lastCard]}
        >
          <Card.Content>
            <View style={styles.headerContainer}>
              <Title numberOfLines={2} style={styles.classTitle}>
                {`${classItem.selectedClass}`} &middot;{" "}
                {`${classItem.selectedLesson}`}
              </Title>
              <IconButton
                icon="delete"
                onPress={() =>
                  confirmDelete(
                    classItem.id,
                    `${classItem.selectedClass} - ${classItem.selectedLesson}`
                  )
                }
                style={styles.deleteButton}
              />
            </View>
            <Paragraph style={styles.dateTime}>
              {`${formatDate(classItem.selectedDate)} at ${formatTime(
                classItem.selectedTime
              )} · ${formatMDY(classItem.selectedDate)}`}
            </Paragraph>
            {classItem.note && (
              <Paragraph style={styles.note}>{classItem.note}</Paragraph>
            )}
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    marginBottom: 16,
    marginHorizontal: 16,
  },
  card: {
    marginBottom: 16,
    marginHorizontal: 16,
  },
  lastCard: {
    marginBottom: 32,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  classTitle: {
    flex: 1,
    marginRight: 8,
  },
  deleteButton: {
    marginTop: -8,
    marginRight: -8,
  },
  dateTime: {
    marginTop: 8,
  },
  note: {
    marginTop: 8,
  },
});

export default ClassList;
