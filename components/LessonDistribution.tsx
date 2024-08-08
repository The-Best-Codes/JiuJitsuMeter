import React from "react";
import { View, Dimensions } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { PieChart } from "react-native-chart-kit";
import { ClassLog, Class } from "@/types";

interface Props {
  classLogs: ClassLog[];
  classes: Class[];
}

const LessonDistribution: React.FC<Props> = ({ classLogs, classes }) => {
  const theme = useTheme();
  const screenWidth = Dimensions.get("window").width;
  const chartWidth = screenWidth * 0.9;

  const getLessonStats = () => {
    const stats: { [key: string]: number } = {};
    classLogs.forEach((log) => {
      const classItem = classes.find((c) => c.id === log.classId);
      const lessonName =
        classItem?.data.find((l) => l.id === log.lessonId)?.name || "Unknown";
      stats[lessonName] = (stats[lessonName] || 0) + 1;
    });
    return Object.entries(stats).map(([name, count]) => ({
      name,
      count,
      color: `#${Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0")}`,
    }));
  };

  const lessonData = getLessonStats();

  return (
    <View>
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          marginBottom: 16,
          color: theme.colors.onBackground,
        }}
      >
        Lesson Distribution
      </Text>
      {lessonData.length > 0 ? (
        <PieChart
          data={lessonData}
          width={chartWidth}
          height={200}
          chartConfig={{
            backgroundColor: theme.colors.background,
            backgroundGradientFrom: theme.colors.background,
            backgroundGradientTo: theme.colors.background,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="count"
          backgroundColor="transparent"
          paddingLeft="15"
        />
      ) : (
        <Text>No lesson data available</Text>
      )}
    </View>
  );
};

export default LessonDistribution;
