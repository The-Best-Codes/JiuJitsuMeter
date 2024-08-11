import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, RefreshControl } from "react-native";
import {
  Text,
  Card,
  ProgressBar,
  List,
  Avatar,
  Button,
  Provider as PaperProvider,
} from "react-native-paper";
import { useTheme } from "@/styles/theme";
import { fetchClassLogs, loadCustomClasses } from "@/utils/storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { initialClasses } from "@/utils/constants";
import { ClassLog, Class, Lesson } from "@/types";

interface Achievement {
  id: number;
  title: string;
  description: string;
  requirement: {
    type: "classes" | "lessons" | "logs" | "level";
    count: number;
  };
}

const LevelsScreen = () => {
  const theme = useTheme();
  const [refreshing, setRefreshing] = useState(true);
  const [level, setLevel] = useState(1);
  const [experience, setExperience] = useState(0);
  const [classCount, setClassCount] = useState(0);
  const [lessonCount, setLessonCount] = useState(0);
  const [unlockedAchievements, setUnlockedAchievements] = useState<any[]>([]);

  const allAchievements = [
    {
      id: 1,
      title: "Class Creator",
      description: "Create your first custom class",
      requirement: { type: "classes", count: 1 },
    },
    {
      id: 2,
      title: "Class Enthusiast",
      description: "Create 5 custom classes",
      requirement: { type: "classes", count: 5 },
    },
    {
      id: 3,
      title: "Class Master",
      description: "Create 10 custom classes",
      requirement: { type: "classes", count: 10 },
    },
    {
      id: 4,
      title: "Lesson Learner",
      description: "Add your first custom lesson",
      requirement: { type: "lessons", count: 1 },
    },
    {
      id: 5,
      title: "Lesson Lover",
      description: "Add 10 custom lessons",
      requirement: { type: "lessons", count: 10 },
    },
    {
      id: 6,
      title: "Lesson Legend",
      description: "Add 50 custom lessons",
      requirement: { type: "lessons", count: 50 },
    },
    {
      id: 7,
      title: "First Step",
      description: "Log your first class",
      requirement: { type: "logs", count: 1 },
    },
    {
      id: 8,
      title: "Consistent Learner",
      description: "Log 10 lessons",
      requirement: { type: "logs", count: 10 },
    },
    {
      id: 9,
      title: "Dedicated Student",
      description: "Log 50 lessons",
      requirement: { type: "logs", count: 50 },
    },
    {
      id: 10,
      title: "Knowledge Seeker",
      description: "Log 100 lessons",
      requirement: { type: "logs", count: 100 },
    },
    {
      id: 11,
      title: "Level Up!",
      description: "Reach level 5",
      requirement: { type: "level", count: 5 },
    },
    {
      id: 12,
      title: "Double Digits",
      description: "Reach level 10",
      requirement: { type: "level", count: 10 },
    },
    {
      id: 13,
      title: "Quarter Century",
      description: "Reach level 25",
      requirement: { type: "level", count: 25 },
    },
    {
      id: 14,
      title: "Halfway There",
      description: "Reach level 50",
      requirement: { type: "level", count: 50 },
    },
    {
      id: 15,
      title: "Centurion",
      description: "Reach level 100",
      requirement: { type: "level", count: 100 },
    },
    {
      id: 16,
      title: "Unbeatable",
      description: "Reach level 200",
      requirement: { type: "level", count: 200 },
    },
    {
      id: 17,
      title: "Grandmaster",
      description: "Reach level 500",
      requirement: { type: "level", count: 500 },
    },
    {
      id: 18,
      title: "Ultimate",
      description: "Reach level 1000",
      requirement: { type: "level", count: 1000 },
    },
    {
      id: 19,
      title: "Early Bird",
      description: "Log a lesson before 8 AM",
      requirement: { type: "time", count: 1, before: "8" },
    },
    {
      id: 20,
      title: "Night Owl",
      description: "Log a lesson after 8 PM",
      requirement: { type: "time", count: 1, after: "20" },
    },
    {
      id: 21,
      title: "Weekend Warrior",
      description: "Log a lesson on Saturday or Sunday",
      requirement: { type: "date", count: 1, on: ["saturday", "sunday"] },
    },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setRefreshing(true);
    const classLogs: ClassLog[] = await fetchClassLogs();
    const customClasses: Class[] = await loadCustomClasses();

    // Merge classes
    const classMap: { [id: string]: Class & { isCustom: boolean } } = {};
    initialClasses.forEach((initialClass: Class) => {
      classMap[initialClass.id] = { ...initialClass, isCustom: false };
    });

    customClasses.forEach((customClass: Class) => {
      if (classMap[customClass.id]) {
        const existingClass = classMap[customClass.id];
        const existingLessonIds = new Set(
          existingClass.data.map((lesson: Lesson) => lesson.id)
        );

        const mergedLessons = [
          ...existingClass.data,
          ...customClass.data
            .filter((lesson: Lesson) => {
              const isCustomLesson = !existingLessonIds.has(lesson.id);
              return isCustomLesson;
            })
            .map((lesson) => ({ ...lesson, isCustom: true })),
        ];

        classMap[customClass.id] = {
          ...existingClass,
          data: mergedLessons,
        };
      } else {
        classMap[customClass.id] = {
          ...customClass,
          isCustom: true,
          data: customClass.data.map((lesson) => ({
            ...lesson,
            isCustom: true,
          })),
        };
      }
    });

    const mergedClasses = Object.values(classMap);

    const totalClasses = mergedClasses.length;
    const totalCustomClasses = mergedClasses.filter(
      (cls) => cls.isCustom
    ).length;
    const totalLessons = mergedClasses.reduce(
      (sum, cls) => sum + cls.data.length,
      0
    );
    const totalCustomLessons = mergedClasses.reduce(
      (sum, cls) =>
        sum +
        cls.data.filter(
          (lesson) => (lesson as Lesson & { isCustom?: boolean }).isCustom
        ).length,
      0
    );
    const loggedLessonsCount = classLogs.length;

    // Calculate XP
    const loggedLessonsXP = loggedLessonsCount * 10;
    const customClassesXP = totalCustomClasses * 10;
    const customLessonsXP = totalCustomLessons * 5;
    const totalExperience = loggedLessonsXP + customClassesXP + customLessonsXP;

    // Calculate unique classes logged
    const uniqueClassesLogged = new Set(classLogs.map((log) => log.classId))
      .size;

    setClassCount(uniqueClassesLogged);
    setLessonCount(loggedLessonsCount);
    setExperience(totalExperience);
    setLevel(Math.floor(totalExperience / 100) + 1);

    updateAchievements(
      totalCustomClasses,
      totalCustomLessons,
      loggedLessonsCount,
      classLogs
    );

    setRefreshing(false);
  };

  const updateAchievements = (
    customClasses: number,
    customLessons: number,
    loggedLessons: number,
    classLogs: ClassLog[] = []
  ) => {
    const newUnlockedAchievements = allAchievements.filter((achievement) => {
      switch (achievement.requirement.type) {
        case "classes":
          return customClasses >= achievement.requirement.count;
        case "lessons":
          return customLessons >= achievement.requirement.count;
        case "logs":
          return loggedLessons >= achievement.requirement.count;
        case "level":
          return level >= achievement.requirement.count;
        case "time":
          return classLogs.some((log: any) => {
            const logTime = new Date(log.time).getHours();
            return logTime < parseInt(achievement.requirement.before as string);
          });
        case "date":
          return classLogs.some((log: any) => {
            const logDate = new Date(log.date).getDay();
            const daysOfWeek = {
              sunday: 0,
              monday: 1,
              tuesday: 2,
              wednesday: 3,
              thursday: 4,
              friday: 5,
              saturday: 6,
            };
            const requiredDays = (achievement as any).requirement.on.map(
              (day: string) => (daysOfWeek as any)[day.toLowerCase()]
            );
            return requiredDays.includes(logDate);
          });
        default:
          return false;
      }
    });

    setUnlockedAchievements(newUnlockedAchievements);
  };

  const experienceToNextLevel = level * 100 - experience;
  const progressToNextLevel = 1 - experienceToNextLevel / 100;

  return (
    <PaperProvider theme={theme}>
      <ScrollView
        style={[styles.container, { paddingTop: 40 }]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={loadData} />
        }
      >
        <Card style={styles.levelCard}>
          <Card.Content>
            <Text style={styles.levelText}>Level {level}</Text>
            <ProgressBar
              progress={progressToNextLevel}
              color={theme.colors.primary}
              style={styles.progressBar}
            />
            <Text style={styles.experienceText}>
              {experienceToNextLevel} XP to next level
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.statsCard}>
          <Card.Content>
            <Text style={styles.statsTitle}>Your Stats</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <MaterialCommunityIcons
                  name="book-open-variant"
                  size={24}
                  color={theme.colors.primary}
                />
                <Text style={styles.statValue}>{classCount}</Text>
                <Text style={styles.statLabel}>Classes</Text>
              </View>
              <View style={styles.statItem}>
                <MaterialCommunityIcons
                  name="notebook"
                  size={24}
                  color={theme.colors.primary}
                />
                <Text style={styles.statValue}>{lessonCount}</Text>
                <Text style={styles.statLabel}>Lessons</Text>
              </View>
              <View style={styles.statItem}>
                <MaterialCommunityIcons
                  name="star"
                  size={24}
                  color={theme.colors.primary}
                />
                <Text style={styles.statValue}>{experience}</Text>
                <Text style={styles.statLabel}>Total XP</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.achievementsCard}>
          <Card.Content>
            <Text style={styles.achievementsTitle}>Achievements</Text>
            {allAchievements.map((achievement) => {
              const isUnlocked = unlockedAchievements.some(
                (a: any) => a.id === achievement.id
              );
              return (
                <List.Item
                  key={achievement.id}
                  title={achievement.title}
                  description={achievement.description}
                  contentStyle={{ height: "auto" }}
                  left={() => (
                    <Avatar.Icon
                      size={40}
                      icon="trophy"
                      style={{ opacity: isUnlocked ? 1 : 0.5 }}
                    />
                  )}
                  right={() => (
                    <Button
                      icon={isUnlocked ? "check" : "lock"}
                      style={{
                        opacity: isUnlocked ? 1 : 0.5,
                      }}
                    >
                      {isUnlocked ? "Unlocked" : "Locked"}
                    </Button>
                  )}
                  style={{ opacity: isUnlocked ? 1 : 0.5 }}
                />
              );
            })}
          </Card.Content>
        </Card>
      </ScrollView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  levelCard: {
    marginBottom: 16,
  },
  levelText: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  progressBar: {
    height: 12,
    borderRadius: 6,
  },
  experienceText: {
    textAlign: "center",
    marginTop: 8,
  },
  statsCard: {
    marginBottom: 16,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#555",
  },
  achievementsCard: {
    marginBottom: 16,
  },
  achievementsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
});

export default LevelsScreen;
