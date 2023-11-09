import React, { useState, useEffect } from "react";
import { View, Text, Alert, StyleSheet } from "react-native";
import axios from "axios";
import AddButton from "./AddButton";
import { Picker } from "@react-native-picker/picker";
import CancelButton from "./CancelButton";

const LeaveRequestForm = ({
  onSubmit,
  onCancel,
  endDateC,
  startDateC,
  selected,
  numberDays,
  leaveRequestData,
  showUpdateModal,
}) => {
  const [leaveType, setLeaveType] = useState("");
  const [leaveTypeOptions, setLeaveTypeOptions] = useState([]);
  const [leaveDuration, setLeaveDuration] = useState("whole day");
  const [startTime, setStartTime] = useState("08:00 AM");
  const [endTime, setEndTime] = useState("08:30 AM");
  const [endTimeOptions, setEndTimeOptions] = useState(
    generateEndTimeOptions("08:00 AM")
  );

  useEffect(() => {
    fetchLeaveTypes();

    if (showUpdateModal && leaveRequestData) {
      setLeaveType(leaveRequestData.leaveType);
      setLeaveDuration(leaveRequestData.leaveDuration);
      setStartTime(leaveRequestData.startTime);
      setEndTime(leaveRequestData.endTime);
    }
  }, []);

  useEffect(() => {
    // When the start time changes, update the end time options
    setEndTimeOptions(generateEndTimeOptions(startTime));
  }, [startTime]);

  const fetchLeaveTypes = () => {
    axios
      .get("http://10.0.2.2:5000/leavetype")
      .then((response) => {
        setLeaveTypeOptions(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSubmit = () => {
    const formData = {
      leaveType,
      leaveDuration,
      startTime: leaveDuration === "hourly" ? startTime : null,
      endTime: leaveDuration === "hourly" ? endTime : null,
    };

    if (showUpdateModal && leaveRequestData) {
      handleSubmitModifiedLeave(formData);
    } else {
      handleSubmitNewLeave(formData);
    }
  };

  const handleSubmitNewLeave = () => {
    axios
      .post("http://10.0.2.2:5000/leaverequest/add", {
        startDate: startDateC,
        endDate: endDateC,
        numberDays,
        leaveType,
        leaveDuration,
        startTime: leaveDuration === "hourly" ? startTime : null,
        endTime: leaveDuration === "hourly" ? endTime : null,
      })
      .then((response) => {
        Alert.alert("Leave request submitted successfully");
        onSubmit();
      })
      .catch((error) => {
        console.log(error);
        Alert.alert("Error submitting leave request");
      });
  };

  const handleSubmitModifiedLeave = () => {
    const formData = {
      startDate: startDateC,
      endDate: endDateC,
      numberDays,
      leaveType,
      leaveDuration,
      startTime: leaveDuration === "hourly" ? startTime : null,
      endTime: leaveDuration === "hourly" ? endTime : null,
    };

    axios
      .put(
        `http://10.0.2.2:5000/leaverequest/updateAll/${leaveRequestData.id}`,
        formData
      )
      .then((response) => {
        Alert.alert("Leave request updated successfully");
        onSubmit();
      })
      .catch((error) => {
        console.log(error);
        Alert.alert("Error updating leave request");
      });
  };

  function generateEndTimeOptions(selectedStartTime) {
    const timeOptions = [];
    const timeRegex = /(\d{2}):(\d{2})/;
    const match = timeRegex.exec(selectedStartTime);

    if (match) {
      let [_, startHour, startMinute] = match.map(Number);

      let currentTime = new Date(0);
      currentTime.setHours(startHour, startMinute, 0, 0);

      while (currentTime.getHours() < 18) {
        // Up to 6:00 PM
        const timeString = currentTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        timeOptions.push(timeString);
        currentTime.setMinutes(currentTime.getMinutes() + 30); // Increment by 30 minutes
      }
    }

    return timeOptions;
  }

  const timeOptions = generateEndTimeOptions(startTime);

  return (
    <View style={styles.formContainer}>
      <Text style={styles.label}>Leave Type:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          style={styles.picker}
          selectedValue={leaveType}
          onValueChange={(itemValue, itemIndex) => setLeaveType(itemValue)}
        >
          <Picker.Item label="" value="" />
          {leaveTypeOptions.map((option) => (
            <Picker.Item
              label={option.value}
              value={option.value}
              key={option.id}
            />
          ))}
        </Picker>
      </View>
      <Text style={styles.label}>Leave Duration:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          style={styles.picker}
          selectedValue={leaveDuration}
          onValueChange={(itemValue) => setLeaveDuration(itemValue)}
        >
          <Picker.Item label="Whole Day" value="whole day" />
          <Picker.Item label="Hourly" value="hourly" />
        </Picker>
      </View>

      {leaveDuration === "hourly" && (
        <View>
          <Text style={styles.label}>Start Time:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              style={styles.picker}
              selectedValue={startTime}
              onValueChange={(itemValue) => setStartTime(itemValue)}
            >
              {timeOptions.map((time, index) => (
                <Picker.Item label={time} value={time} key={index} />
              ))}
            </Picker>
          </View>
          <Text style={styles.label}>End Time:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              style={styles.picker}
              selectedValue={endTime}
              onValueChange={(itemValue) => setEndTime(itemValue)}
            >
              {endTimeOptions.map((time, index) => (
                <Picker.Item label={time} value={time} key={index} />
              ))}
            </Picker>
          </View>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <AddButton onPress={handleSubmit} disabled={selected}>
          {showUpdateModal && leaveRequestData ? "Update" : "Submit"}
        </AddButton>
        <CancelButton onPress={onCancel}>Cancel</CancelButton>
      </View>
    </View>
  );
};

export default LeaveRequestForm;

const styles = StyleSheet.create({
  formContainer: {
    padding: 20,
    borderRadius: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  pickerContainer: {
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    marginBottom: 10,
    borderRadius: 15,
    width: 350,
  },
  picker: {
    textAlign: "center",
  },
});
