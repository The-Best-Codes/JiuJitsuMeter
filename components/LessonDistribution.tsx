import React from "react";
import { View, Dimensions } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { PieChart } from "react-native-chart-kit";
import { ClassItem } from "@/types";
import { getStats } from "@/utils/statsUtils";

interface Props {
  classes: ClassItem[];
}

const LessonDistribution: React.FC<Props> = ({ classes }) => {
  const theme = useTheme();
  const lessonData = getStats(classes, "selectedLesson");

  const screenWidth = Dimensions.get("window").width;
  const chartWidth = screenWidth * 0.9;

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
