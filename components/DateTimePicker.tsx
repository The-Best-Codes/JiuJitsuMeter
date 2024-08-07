import React, { useState } from "react";
import { View } from "react-native";
import { Button } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function CustomDateTimePicker({
  selectedDate,
  selectedTime,
  onSelectDateTime,
}: any) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleDateChange = (event: any, date: Date | undefined) => {
    setShowDatePicker(false);
    if (date) onSelectDateTime(date, selectedTime);
  };

  const handleTimeChange = (event: any, time: Date | undefined) => {
    setShowTimePicker(false);
    if (time) onSelectDateTime(selectedDate, time);
  };

  return (
    <View style={{ marginTop: 16 }}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          gap: 8,
          justifyContent: "space-between",
        }}
      >
        <Button
          icon={"calendar"}
          style={{ flex: 1, marginVertical: 8 }}
          mode="contained"
          onPress={() => setShowDatePicker(true)}
        >
          {selectedDate ? selectedDate.toDateString() : "Select Date"}
        </Button>
        <Button
          icon={"clock"}
          style={{ flex: 1, marginVertical: 8 }}
          mode="contained"
          onPress={() => setShowTimePicker(true)}
        >
          {selectedTime ? selectedTime.toLocaleTimeString() : "Select Time"}
        </Button>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate || new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={selectedTime || new Date()}
          mode="time"
          display="default"
          onChange={handleTimeChange}
        />
      )}
    </View>
  );
}
