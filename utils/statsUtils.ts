import { ClassItem } from "@/types";

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
  "#8B9467",
  "#6495ED",
  "#DC143C",
  "#B0C4DE",
  "#2E865F",
  "#FFC080",
  "#C71585",
  "#778899",
  "#FFB6C1",
  "#C5C3C5",
  "#4682B4",
  "#008080",
  "#7A288A",
  "#B22222",
  "#4169E1",
  "#FA8072",
  "#8B0A1A",
  "#228B22",
  "#CD9B9B",
  "#808000",
  "#DCDCDC",
  "#F5DEB3",
  "#808080",
  "#C0C0C0",
  "#00FF00",
  "#0000FF",
  "#FF00FF",
  "#FFFF00",
  "#00FFFF",
  "#800000",
  "#008000",
  "#000080",
  "#800080",
  "#808000",
];

export const getStats = (classes: ClassItem[], key: keyof ClassItem) => {
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
