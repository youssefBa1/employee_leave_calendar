import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";

const FilterModal = ({ isVisible, onClose, onApplyFilters }) => {
  const [filterStartDate, setfilterStartDate] = useState("");
  const [filterEndDate, setfilterEndDate] = useState("");
  const [filterLeaveType, setfilterLeaveType] = useState("All");

  const [showDatePicker1, setShowDatePicker1] = useState(false);
  const [showDatePicker2, setShowDatePicker2] = useState(false);

  const [date1, setDate1] = useState(null);
  const [date2, setDate2] = useState(null);

  const [leaveTypes, setLeaveTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isVisible) {
      setShowDatePicker1(false);
      setShowDatePicker2(false);
    }

    // Fetch leave types from the URL
    fetch("http://10.0.2.2:5000/leavetype")
      .then((response) => response.json())
      .then((data) => {
        setLeaveTypes(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        setIsLoading(false);
      });
  }, [isVisible]);

  const showDatepicker1 = () => {
    // Show date picker for the first TextInput
    setShowDatePicker1(true);
  };

  const showDatepicker2 = () => {
    // Show date picker for the second TextInput
    setShowDatePicker2(true);
  };

  const applyFilters = () => {
    // Pass the filter criteria to the parent component
    onApplyFilters({
      filterStartDate,
      filterEndDate,
      filterLeaveType,
      date1,
      date2,
    });

    // Close the modal
    onClose();
  };

  return (
    <Modal transparent visible={isVisible} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Filters</Text>
          <View style={styles.datePickerContainer}>
            <Text style={styles.datePickerLabel}>From</Text>
            <TouchableOpacity onPress={showDatepicker1}>
              <TextInput
                style={styles.filterInput}
                placeholder="Select Date"
                value={date1 ? date1.toDateString() : ""}
                editable={false}
              />
            </TouchableOpacity>
            {showDatePicker1 && (
              <DateTimePicker
                value={date1 || new Date()}
                mode="date"
                display="spinner"
                onChange={(event, selectedDate) => {
                  setShowDatePicker1(false);
                  if (selectedDate) {
                    setDate1(selectedDate);
                  }
                }}
              />
            )}
          </View>

          <View style={styles.datePickerContainer}>
            <Text style={styles.datePickerLabel}>To</Text>
            <TouchableOpacity onPress={showDatepicker2}>
              <TextInput
                style={styles.filterInput}
                placeholder="Select Date"
                value={date2 ? date2.toDateString() : ""}
                editable={false}
              />
            </TouchableOpacity>
            {showDatePicker2 && (
              <DateTimePicker
                value={date2 || new Date()}
                mode="date"
                display="spinner"
                onChange={(event, selectedDate) => {
                  setShowDatePicker2(false);
                  if (selectedDate) {
                    setDate2(selectedDate);
                  }
                }}
              />
            )}
          </View>

          <Picker
            style={styles.picker}
            selectedValue={filterLeaveType} // Use filterLeaveType here
            onValueChange={(itemValue, itemIndex) =>
              setfilterLeaveType(itemValue)
            } // Update the selected value in filterLeaveType state
          >
            <Picker.Item label="" value="All" />
            {leaveTypes.map((option) => (
              <Picker.Item
                label={option.value}
                value={option.value}
                key={option.id}
              />
            ))}
          </Picker>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
              <Text style={{ color: "#fff", fontWeight: "bold" }}>
                Apply Filters
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    width: "80%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  filterInput: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    color: "#333",
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  applyButton: {
    flex: 1,
    backgroundColor: "#20639b",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  closeButton: {
    flex: 1,
    backgroundColor: "#e63946",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  datePickerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  datePickerLabel: {
    flex: 1,
    marginRight: 12,
    color: "#333",
    fontSize: 16,
  },
});

export default FilterModal;
