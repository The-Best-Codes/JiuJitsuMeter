import React from "react";
import { View, Dimensions } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { PieChart } from "react-native-chart-kit";
import { ClassLog, Class } from "@/types";

interface Props {
  classLogs: ClassLog[];
  classes: Class[];
}

const ClassDistribution: React.FC<Props> = ({ classLogs, classes }) => {
  const theme = useTheme();
  const screenWidth = Dimensions.get("window").width;
  const chartWidth = screenWidth * 0.9;

  const getClassStats = () => {
    const stats: { [key: string]: number } = {};
    classLogs.forEach((log) => {
      const className =
        classes.find((c) => c.id === log.classId)?.class || "Unknown";
      stats[className] = (stats[className] || 0) + 1;
    });
    return Object.entries(stats).map(([name, count]) => ({
      name,
      count,
      color: `#${Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0")}`,
    }));
  };

  const classData = getClassStats();

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
        Class Distribution
      </Text>
      {classData.length > 0 ? (
        <PieChart
          data={classData}
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
        <Text>No class data available</Text>
      )}
    </View>
  );
};

export default ClassDistribution;
