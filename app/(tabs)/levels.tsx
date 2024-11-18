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
import i18n from "@/i18n";

interface Achievement {
  id: number;
  title: string;
  description: string;
  xp: number;
  repeatable?: { limit?: number };
  requirement: {
    type: "classes" | "lessons" | "logs" | "level" | "time" | "date";
    count: number;
    before?: string;
    after?: string;
    on?: string[];
  };
}

const LevelsScreen = () => {
  const theme = useTheme();
  const [refreshing, setRefreshing] = useState(true);
  const [level, setLevel] = useState(1);
  const [experience, setExperience] = useState(0);
  const [classCount, setClassCount] = useState(0);
  const [lessonCount, setLessonCount] = useState(0);
  const [unlockedAchievements, setUnlockedAchievements] = useState<
    Achievement[]
  >([]);
  const [totalCustomClasses, setTotalCustomClasses] = useState(0);
  const [totalCustomLessons, setTotalCustomLessons] = useState(0);
  const [loggedLessonsCount, setLoggedLessonsCount] = useState(0);
  const [classLogs, setClassLogs] = useState<ClassLog[]>([]);

  const allAchievements: Achievement[] = [
    {
      id: 1,
      title: "Class Creator",
      description: "Create your first custom class",
      xp: 20,
      requirement: { type: "classes", count: 1 },
    },
    {
      id: 2,
      title: "Class Enthusiast",
      description: "Create 5 custom classes",
      xp: 50,
      requirement: { type: "classes", count: 5 },
    },
    {
      id: 3,
      title: "Class Master",
      description: "Create 10 custom classes",
      xp: 100,
      requirement: { type: "classes", count: 10 },
    },
    {
      id: 4,
      title: "Lesson Learner",
      description: "Add your first custom lesson",
      xp: 10,
      requirement: { type: "lessons", count: 1 },
    },
    {
      id: 5,
      title: "Lesson Lover",
      description: "Add 10 custom lessons",
      xp: 30,
      requirement: { type: "lessons", count: 10 },
    },
    {
      id: 6,
      title: "Lesson Legend",
      description: "Add 50 custom lessons",
      xp: 100,
      requirement: { type: "lessons", count: 50 },
    },
    {
      id: 7,
      title: "First Step",
      description: "Log your first class",
      xp: 5,
      requirement: { type: "logs", count: 1 },
    },
    {
      id: 8,
      title: "Consistent Learner",
      description: "Log 10 lessons",
      xp: 25,
      requirement: { type: "logs", count: 10 },
    },
    {
      id: 9,
      title: "Dedicated Student",
      description: "Log 50 lessons",
      xp: 75,
      requirement: { type: "logs", count: 50 },
    },
    {
      id: 10,
      title: "Knowledge Seeker",
      description: "Log 100 lessons",
      xp: 150,
      requirement: { type: "logs", count: 100 },
    },
    {
      id: 11,
      title: "Level Up!",
      description: "Reach level 5",
      xp: 50,
      requirement: { type: "level", count: 5 },
    },
    {
      id: 12,
      title: "Double Digits",
      description: "Reach level 10",
      xp: 150,
      requirement: { type: "level", count: 10 },
    },
    {
      id: 13,
      title: "Level Leader",
      description: "Reach level 15",
      xp: 200,
      requirement: { type: "level", count: 15 },
    },
    {
      id: 14,
      title: "Level Master",
      description: "Reach level 20",
      xp: 500,
      requirement: { type: "level", count: 20 },
    },
    {
      id: 15,
      title: "Craziness!",
      description: "Reach level 25",
      xp: 1000,
      requirement: { type: "level", count: 25 },
    },
    {
      id: 16,
      title: "Early Bird",
      description: "Log a lesson before 8 AM",
      xp: 15,
      repeatable: { limit: 10 },
      requirement: { type: "time", count: 1, before: "8" },
    },
    {
      id: 17,
      title: "Night Owl",
      description: "Log a lesson after 7 PM",
      xp: 15,
      repeatable: { limit: 10 },
      requirement: { type: "time", count: 1, after: "19" },
    },
    {
      id: 18,
      title: "Weekend Warrior",
      description: "Log a lesson on Saturday or Sunday",
      xp: 20,
      repeatable: { limit: 10 },
      requirement: { type: "date", count: 1, on: ["saturday", "sunday"] },
    },
    {
      id: 19,
      title: "Streak Master",
      description: "Log lessons for 7 consecutive days",
      xp: 50,
      repeatable: {},
      requirement: { type: "logs", count: 7 },
    },
    {
      id: 20,
      title: "Subject Explorer",
      description: "Log lessons in 5 different classes",
      xp: 30,
      requirement: { type: "classes", count: 5 },
    },
    {
      id: 21,
      title: "Speed Learner",
      description: "Complete 3 lessons in a day",
      xp: 25,
      repeatable: { limit: 10 },
      requirement: { type: "logs", count: 3 },
    },
    {
      id: 22,
      title: "Lightning Learner",
      description: "Complete 5 lessons in a day",
      xp: 40,
      repeatable: { limit: 10 },
      requirement: { type: "logs", count: 5 },
    },
    {
      id: 23,
      title: "Lifelong Learner",
      description: "Log lessons for 30 consecutive days",
      xp: 200,
      requirement: { type: "logs", count: 30 },
    },
    {
      id: 24,
      title: "Jack of All Trades",
      description: "Log lessons in 5 different classes",
      xp: 75,
      requirement: { type: "classes", count: 10 },
    },
    {
      id: 25,
      title: "Master of All",
      description: "Log lessons in 10 different classes",
      xp: 150,
      requirement: { type: "classes", count: 20 },
    },
  ];

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!refreshing) {
      updateAchievements(
        totalCustomClasses,
        totalCustomLessons,
        loggedLessonsCount,
        classLogs
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    refreshing,
    totalCustomClasses,
    totalCustomLessons,
    loggedLessonsCount,
    classLogs,
  ]);

  const loadData = async () => {
    setRefreshing(true);
    setLevel(0);
    setExperience(0);
    setClassCount(0);
    setLessonCount(0);
    setUnlockedAchievements([]);
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

    const totalCustomClasses = mergedClasses.filter(
      (cls) => cls.isCustom
    ).length;
    const totalCustomLessons = mergedClasses.reduce(
      (sum, cls) =>
        sum +
        cls.data.filter(
          (lesson) => (lesson as Lesson & { isCustom?: boolean }).isCustom
        ).length,
      0
    );
    const loggedLessonsCount = classLogs.length;

    // Calculate unique classes logged
    const uniqueClassesLogged = new Set(classLogs.map((log) => log.classId))
      .size;

    setTotalCustomClasses(totalCustomClasses);
    setTotalCustomLessons(totalCustomLessons);
    setLoggedLessonsCount(loggedLessonsCount);
    setClassLogs(classLogs);

    setClassCount(uniqueClassesLogged);
    setLessonCount(loggedLessonsCount);
    setRefreshing(false);
  };

  const calculateLevelProgress = (xp: number) => {
    let level = 1;
    let xpRequired = 10;
    let totalXpRequired = xpRequired;

    while (xp >= xpRequired) {
      xp -= xpRequired;
      level++;
      xpRequired += 5;
      totalXpRequired += xpRequired;
    }

    const progressInCurrentLevel = xpRequired - (totalXpRequired - experience);
    const totalProgressRequiredInCurrentLevel = xpRequired;

    return {
      level,
      progressInCurrentLevel,
      totalProgressRequiredInCurrentLevel,
    };
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
            if (achievement.requirement.before) {
              return logTime < parseInt(achievement.requirement.before);
            }
            if (achievement.requirement.after) {
              return logTime > parseInt(achievement.requirement.after);
            }
            return false;
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
            const requiredDays = achievement.requirement.on?.map(
              (day: string) => (daysOfWeek as any)[day.toLowerCase()]
            );
            return requiredDays?.includes(logDate);
          });
        default:
          return false;
      }
    });

    // Calculate XP from logged lessons
    let totalXP = loggedLessons * 10; // Each logged lesson is worth 10 XP

    // Add XP from achievements
    newUnlockedAchievements.forEach((achievement) => {
      const existingAchievement = unlockedAchievements.find(
        (a) => a.id === achievement.id
      );
      if (!existingAchievement) {
        totalXP += achievement.xp;
      } else if (achievement.repeatable) {
        const timesUnlocked = (existingAchievement as any).timesUnlocked || 1;
        if (
          !achievement.repeatable.limit ||
          timesUnlocked < achievement.repeatable.limit
        ) {
          totalXP += achievement.xp;
          (achievement as any).timesUnlocked = timesUnlocked + 1;
        }
      }
    });

    setExperience(totalXP);
    const { level } = calculateLevelProgress(totalXP);
    setLevel(level);
    setUnlockedAchievements(newUnlockedAchievements);
  };

  const { progressInCurrentLevel, totalProgressRequiredInCurrentLevel } =
    calculateLevelProgress(experience);

  const experienceToNextLevel =
    totalProgressRequiredInCurrentLevel - progressInCurrentLevel;
  const progressToNextLevel =
    progressInCurrentLevel / totalProgressRequiredInCurrentLevel;

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
            <Text style={styles.levelText}>
              {i18n.t("stats.level")} {level}
            </Text>
            <ProgressBar
              progress={progressToNextLevel}
              color={theme.colors.primary}
              style={styles.progressBar}
            />
            <Text style={styles.experienceText}>
              {progressInCurrentLevel}/{totalProgressRequiredInCurrentLevel}{" "}
              &middot; {experienceToNextLevel} {i18n.t("stats.xpToNextLevel")}
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.statsCard}>
          <Card.Content>
            <Text style={styles.statsTitle}>{i18n.t("stats.yourStats")}</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <MaterialCommunityIcons
                  name="book-open-variant"
                  size={24}
                  color={theme.colors.primary}
                />
                <Text style={styles.statValue}>{classCount}</Text>
                <Text style={styles.statLabel}>
                  {i18n.t("classes.classes")}
                </Text>
              </View>
              <View style={styles.statItem}>
                <MaterialCommunityIcons
                  name="notebook"
                  size={24}
                  color={theme.colors.primary}
                />
                <Text style={styles.statValue}>{lessonCount}</Text>
                <Text style={styles.statLabel}>
                  {i18n.t("classes.lessons")}
                </Text>
              </View>
              <View style={styles.statItem}>
                <MaterialCommunityIcons
                  name="star"
                  size={24}
                  color={theme.colors.primary}
                />
                <Text style={styles.statValue}>{experience}</Text>
                <Text style={styles.statLabel}>{i18n.t("stats.totalXp")}</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.achievementsCard}>
          <Card.Content>
            <Text style={styles.achievementsTitle}>Achievements</Text>
            {allAchievements.map((achievement) => {
              const unlockedAchievement = unlockedAchievements.find(
                (a) => a.id === achievement.id
              );
              const isUnlocked = !!unlockedAchievement;
              const timesUnlocked =
                (unlockedAchievement as any)?.timesUnlocked || 1;
              return (
                <List.Item
                  key={achievement.id}
                  title={achievement.title}
                  description={`${achievement.description} (+${achievement.xp} XP)`}
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
                      {isUnlocked
                        ? `${i18n.t("progress.unlocked")} ${
                            achievement.repeatable ? `x${timesUnlocked}` : ""
                          } (+${achievement.xp * (timesUnlocked || 1)} XP)`
                        : i18n.t("progress.locked")}
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
