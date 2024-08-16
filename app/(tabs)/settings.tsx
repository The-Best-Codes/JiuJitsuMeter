import React, { useState, useEffect } from "react";
import { View, ScrollView, RefreshControl, StyleSheet } from "react-native";
import {
  List,
  Text,
  Provider as PaperProvider,
  RadioButton,
} from "react-native-paper";
import { useTheme } from "@/styles/theme";
import { useNavigation } from "@react-navigation/native";
import {
  getLanguage,
  getAvailableLanguages,
  setLanguage,
} from "@/utils/langSelect";

const SettingsPage: React.FC = () => {
  const theme = useTheme();
  const navigation: any = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [languagePreference, setLanguagePreference] = useState<string>("");
  const [languageExpanded, setLanguageExpanded] = useState(false);
  const availableLanguages = getAvailableLanguages();

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const currentLanguage = await getLanguage();
      setLanguagePreference(currentLanguage);
      setLanguage(currentLanguage);
    } catch (error) {
      console.error("Error loading preferences:", error);
    }
  };

  const saveLanguagePreference = async (language: string) => {
    try {
      await setLanguage(language);
      setLanguagePreference(language);
    } catch (error) {
      console.error("Error saving language preference:", error);
    }
  };

  const editCustomClassSettings = () => {
    navigation.navigate("EditCustomClass");
  };

  const onRefresh = () => {
    // Implement this later
  };

  const toggleLanguageExpanded = () => {
    setLanguageExpanded(!languageExpanded);
  };

  return (
    <PaperProvider theme={theme}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.container}>
          <List.Item
            right={() => <List.Icon icon="arrow-right" />}
            title="Manage Custom Class"
            onPress={editCustomClassSettings}
          />
        </View>
      </ScrollView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  radioItem: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 16,
    marginVertical: 8,
  },
});

export default SettingsPage;
