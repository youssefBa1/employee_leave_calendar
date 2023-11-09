import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import axios from "axios";

function LeavesOptionsScreen() {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [newLeaveType, setNewLeaveType] = useState("");
  const [editingIndex, setEditingIndex] = useState(-1);

  // Fetch leave types from the server
  useEffect(() => {
    axios
      .get("http://10.0.2.2:5000/leavetype")
      .then((response) => {
        setLeaveTypes(response.data);
      })
      .catch((error) => {
        console.error("Error fetching leave types:", error);
      });
  }, []);

  // Function to handle adding a new leave type
  const handleAddLeaveType = () => {
    if (newLeaveType.trim() !== "") {
      // Send a POST request to add the new leave type
      axios
        .post("http://10.0.2.2:5000/leavetype/add", { value: newLeaveType })
        .then((response) => {
          // Update the leaveTypes state with the newly added leave type
          setLeaveTypes([...leaveTypes, response.data]);
          setNewLeaveType(""); // Clear the input field
        })
        .catch((error) => {
          console.error("Error adding leave type:", error);
        });
    }
  };

  // Function to handle updating a leave type
  const handleUpdateLeaveType = (index) => {
    const updatedLeaveType = leaveTypes[index];

    // Send a PUT request to update the leave type
    axios
      .put(`http://10.0.2.2:5000/leavetype/update/${updatedLeaveType.id}`, {
        value: updatedLeaveType.value,
      })
      .then(() => {
        setEditingIndex(-1); // Clear the editing index
      })
      .catch((error) => {
        console.error("Error updating leave type:", error);
      });
  };

  // Function to handle deleting a leave type
  const handleDeleteLeaveType = (index) => {
    const leaveTypeId = leaveTypes[index].id;

    // Send a DELETE request to remove the leave type
    axios
      .delete(`http://10.0.2.2:5000/leavetype/delete/${leaveTypeId}`)
      .then(() => {
        // Update the leaveTypes state by removing the deleted leave type
        const updatedLeaveTypes = [...leaveTypes];
        updatedLeaveTypes.splice(index, 1);
        setLeaveTypes(updatedLeaveTypes);
      })
      .catch((error) => {
        console.error("Error deleting leave type:", error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Leave Options</Text>
      {leaveTypes.map((leaveType, index) => (
        <View key={leaveType.id} style={styles.leaveTypeRow}>
          {editingIndex === index ? (
            <TextInput
              value={leaveType.value}
              onChangeText={(text) => {
                // Update the leave type name locally
                const updatedLeaveTypes = leaveTypes.map((lt, i) =>
                  i === index ? { ...lt, value: text } : lt
                );
                setLeaveTypes(updatedLeaveTypes);
              }}
              style={styles.leaveTypeInput}
            />
          ) : (
            // Display leave type name using Text component
            <Text style={styles.leaveTypeName}>{leaveType.value}</Text>
          )}

          {editingIndex === index ? (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={() => handleUpdateLeaveType(index)}
                style={styles.editButton}
              >
                <Text style={styles.editButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={() => setEditingIndex(index)}
                style={styles.editButton}
              >
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDeleteLeaveType(index)}
                style={styles.deleteButton}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ))}
      {editingIndex === -1 ? ( // Conditionally render when not editing
        <View style={styles.leaveTypeRow}>
          <TextInput
            value={newLeaveType}
            onChangeText={setNewLeaveType}
            style={styles.leaveTypeInput}
            placeholder="Enter new leave type"
          />
          <TouchableOpacity
            onPress={handleAddLeaveType}
            style={styles.addButton}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  leaveTypeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  leaveTypeName: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
  },
  leaveTypeInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginRight: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  editButton: {
    backgroundColor: "#3ea2ee",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 10,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "red",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 10,
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "#3ea2ee",
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignSelf: "flex-end",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default LeavesOptionsScreen;
