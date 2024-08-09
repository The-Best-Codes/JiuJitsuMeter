import React from "react";
import { View, Dimensions, ScrollView } from "react-native";
import { Text, Provider as PaperProvider } from "react-native-paper";
import { useTheme } from "@/styles/theme";
import { BarChart } from "react-native-chart-kit";
import { ClassLog } from "@/types";

interface Props {
  classLogs: ClassLog[];
}

const TimeDistribution: React.FC<Props> = ({ classLogs }) => {
  const theme = useTheme();
  const screenWidth = Dimensions.get("window").width;
  const chartWidth = Math.max(1000, screenWidth * 2);

  const getTimeStats = () => {
    const stats = Array(24).fill(0);
    classLogs.forEach((log) => {
      const hour = new Date(log.time || Date.now()).getHours();
      stats[hour]++;
    });
    return stats;
  };

  const timeData = getTimeStats();

  const formatLabel = (hour: number) => {
    const period = hour < 12 ? "AM" : "PM";
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${formattedHour} ${period}`;
  };

  const data = {
    labels: Array.from({ length: 24 }, (_, i) => formatLabel(i)),
    datasets: [
      {
        data: timeData,
        color: (opacity = 1) => `rgba(0, 100, 200, ${opacity})`,
      },
    ],
  };

  return (
    <PaperProvider theme={theme}>
      <View>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            marginBottom: 16,
            color: theme.colors.onBackground,
          }}
        >
          Time Distribution
        </Text>
        {classLogs.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <BarChart
              data={data}
              width={chartWidth}
              height={220}
              yAxisLabel=""
              yAxisSuffix=""
              chartConfig={{
                backgroundColor: theme.colors.background,
                backgroundGradientFrom: theme.colors.background,
                backgroundGradientTo: theme.colors.background,
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(0, 100, 200, ${opacity})`,
                labelColor: (opacity = 1) => theme.colors.onBackground,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: "6",
                  strokeWidth: "2",
                  stroke: "#ffa726",
                },
                propsForLabels: {
                  fontSize: 10,
                },
              }}
              style={{
                marginVertical: 8,
                marginEnd: 16,
                borderRadius: 16,
              }}
              showValuesOnTopOfBars={true}
              fromZero={true}
            />
          </ScrollView>
        ) : (
          <Text>No time data available</Text>
        )}
      </View>
    </PaperProvider>
  );
};

export default TimeDistribution;
