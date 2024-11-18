import React, { useState } from "react";
import { ScrollView, RefreshControl, StyleSheet } from "react-native";
import {
  List,
  Provider as PaperProvider,
} from "react-native-paper";
import { useTheme } from "@/styles/theme";
import { useNavigation } from "@react-navigation/native";

const SettingsPage: React.FC = () => {
  const theme = useTheme();
  const navigation: any = useNavigation();
  const [refreshing] = useState(false);

  const editCustomClassSettings = () => {
    navigation.navigate("EditCustomClass");
  };

  const toggleDarkMode = () => {
    // TODO: Implement dark mode toggle
  };

  return (
    <PaperProvider theme={theme}>
      <ScrollView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        refreshControl={
          <RefreshControl refreshing={refreshing} />
        }
      >
        <List.Section>
          <List.Item
            title="Custom Class Settings"
            onPress={editCustomClassSettings}
            left={(props) => <List.Icon {...props} icon="cog" />}
          />
          <List.Item
            title="Dark Mode"
            onPress={toggleDarkMode}
            left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
          />
        </List.Section>
      </ScrollView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    marginBottom: 8,
  },
});

export default SettingsPage;
