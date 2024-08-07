import React from "react";
import { View } from "react-native";
import { TextInput } from "react-native-paper";

export default function NoteInput({ note, onChangeNote }: any) {
  return (
    <View style={{ marginTop: 16 }}>
      <TextInput
        value={note}
        onChangeText={onChangeNote}
        label="Add a note (optional)"
        mode="outlined"
        multiline
        numberOfLines={4}
      />
    </View>
  );
}
