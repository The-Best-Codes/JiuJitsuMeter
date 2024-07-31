import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  RefreshControl,
  TouchableOpacity,
  Alert,
  useColorScheme,
  StyleSheet,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { PieChart } from "react-native-chart-kit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

interface ClassItem {
  id: string;
  selectedClass: string;
  selectedLesson: string;
  selectedDate: string;
  selectedTime: string;
  note?: string;
}

const ExplorePage: React.FC = () => {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const colorScheme = useColorScheme();

  const fetchClasses = useCallback(async () => {
    try {
      const classesData = await AsyncStorage.getItem("classes");
      if (classesData) {
        const parsedData = JSON.parse(classesData);
        setClasses(Array.isArray(parsedData) ? parsedData : []);
      }
    } catch (error) {
      console.error("Error fetching classes:", error);
      setClasses([]);
    }
  }, []);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchClasses();
    setRefreshing(false);
  }, [fetchClasses]);

  const deleteClass = useCallback(
    async (id: string) => {
      Alert.alert(
        "Delete Class",
        "Are you sure you want to delete this class log?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Delete",
            onPress: async () => {
              const updatedClasses = classes.filter(
                (classItem) => classItem.id !== id
              );
              setClasses(updatedClasses);
              try {
                await AsyncStorage.setItem(
                  "classes",
                  JSON.stringify(updatedClasses)
                );
              } catch (error) {
                console.error("Error saving updated classes:", error);
              }
            },
          },
        ]
      );
    },
    [classes]
  );

  const chartColors = [
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#4BC0C0",
    "#9966FF",
    "#FF9F40",
    "#FF6384",
    "#C9CBCF",
    "#4BC0C0",
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
  ];

  const getStats = (key: keyof ClassItem) => {
    const stats: { [key: string]: number } = {};
    classes.forEach((classItem) => {
      let value = classItem[key] as string;
      if (key === "selectedTime" && value) {
        try {
          const date = new Date(value);
          const roundedTime = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            date.getHours(),
            Math.floor(date.getMinutes() / 15) * 15
          );
          value = roundedTime.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "numeric",
          });
        } catch (error) {
          console.error("Error processing date:", error);
          value = "Invalid Time";
        }
      }
      if (value) {
        stats[value] = (stats[value] || 0) + 1;
      }
    });
    return Object.entries(stats).map(([name, count], index) => ({
      name,
      count,
      color: chartColors[index % chartColors.length],
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    }));
  };

  const classData = getStats("selectedClass");
  const lessonData = getStats("selectedLesson");
  const timeData = getStats("selectedTime");

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", { weekday: "long" });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  };

  const formatTime = (timeString: string) => {
    try {
      const date = new Date(timeString);
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
      });
    } catch (error) {
      console.error("Error formatting time:", error);
      return "Invalid Time";
    }
  };

  const formatMDY = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  };

  const theme = {
    backgroundColor: colorScheme === "dark" ? "#121212" : "#f0f8ff",
    textColor: colorScheme === "dark" ? "#ffffff" : "#000000",
    primaryColor: colorScheme === "dark" ? "#bb86fc" : "#1e90ff",
    secondaryColor: colorScheme === "dark" ? "#3700b3" : "#b0c4de",
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.backgroundColor }]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Class Distribution</Text>
        <TouchableOpacity onPress={onRefresh}>
          <Ionicons name="refresh" size={24} color={theme.textColor} />
        </TouchableOpacity>
      </View>
      {classData.length > 0 ? (
        <PieChart
          data={classData}
          width={300}
          height={200}
          chartConfig={{
            backgroundColor: theme.backgroundColor,
            backgroundGradientFrom: theme.backgroundColor,
            backgroundGradientTo: theme.backgroundColor,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="count"
          backgroundColor="transparent"
          paddingLeft="15"
        />
      ) : (
        <Text style={[styles.noDataText, { color: theme.textColor }]}>
          No class data available
        </Text>
      )}

      <Text style={[styles.title, { color: theme.textColor }]}>
        Lesson Distribution
      </Text>
      {lessonData.length > 0 ? (
        <PieChart
          data={lessonData}
          width={300}
          height={200}
          chartConfig={{
            backgroundColor: theme.backgroundColor,
            backgroundGradientFrom: theme.backgroundColor,
            backgroundGradientTo: theme.backgroundColor,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="count"
          backgroundColor="transparent"
          paddingLeft="15"
        />
      ) : (
        <Text style={[styles.noDataText, { color: theme.textColor }]}>
          No lesson data available
        </Text>
      )}

      <Text style={[styles.title, { color: theme.textColor }]}>
        Time Distribution
      </Text>
      {timeData.length > 0 ? (
        <PieChart
          data={timeData}
          width={300}
          height={200}
          chartConfig={{
            backgroundColor: theme.backgroundColor,
            backgroundGradientFrom: theme.backgroundColor,
            backgroundGradientTo: theme.backgroundColor,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="count"
          backgroundColor="transparent"
          paddingLeft="15"
        />
      ) : (
        <Text style={[styles.noDataText, { color: theme.textColor }]}>
          No time data available
        </Text>
      )}

      <Text style={[styles.title, { color: theme.textColor }]}>
        Your Classes
      </Text>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {classes.map((classItem) => (
          <View key={classItem.id} style={styles.classItem}>
            <View style={styles.classHeader}>
              <Text
                style={[
                  styles.classHeaderText,
                  { maxWidth: "80%", color: theme.primaryColor },
                ]}
              >
                {classItem.selectedClass} - {classItem.selectedLesson}
              </Text>
              <TouchableOpacity onPress={() => deleteClass(classItem.id)}>
                <Ionicons name="trash-outline" size={24} color="red" />
              </TouchableOpacity>
            </View>
            <Text style={[styles.classTime, { color: theme.textColor }]}>
              {formatDate(classItem.selectedDate)} at{" "}
              {formatTime(classItem.selectedTime)} &middot;{" "}
              {formatMDY(classItem.selectedDate)}
            </Text>
            {classItem.note && (
              <Text style={[styles.classNote, { color: theme.textColor }]}>
                {classItem.note}
              </Text>
            )}
          </View>
        ))}
      </ScrollView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 50,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    color: "#1e90ff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    marginTop: 16,
  },
  classItem: {
    backgroundColor: "#ffffff",
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  classHeader: {
    color: "#333",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  classHeaderText: {
    color: "#333",
    fontSize: 20,
    fontWeight: "bold",
  },
  classTime: {
    fontSize: 18,
    color: "#222",
    marginBottom: 4,
  },
  classNote: {
    fontSize: 14,
    color: "#777",
  },
  noDataText: {
    color: "#000",
    fontSize: 16,
    textAlign: "center",
    marginVertical: 20,
  },
});

export default ExplorePage;
