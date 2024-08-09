import React from "react";
import { View, Dimensions, ScrollView } from "react-native";
import { Text, Provider as PaperProvider } from "react-native-paper";
import { useTheme } from "@/styles/theme";
import { PieChart } from "react-native-chart-kit";
import { ClassLog, Class } from "@/types";

interface Props {
  classLogs: ClassLog[];
  classes: Class[];
}

const LessonDistribution: React.FC<Props> = ({ classLogs, classes }) => {
  const theme = useTheme();
  const screenWidth = Dimensions.get("window").width;
  const chartWidth = screenWidth * 1;

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
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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
            backgroundColor="#ffffff"
            style={{
              borderRadius: 16,
            }}
            paddingLeft={(0 - chartWidth / 15) as any}
          />
        </ScrollView>
      ) : (
        <Text>No lesson data available</Text>
      )}
    </View>
  );
};

export default LessonDistribution;
