import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  Pressable,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import FilterModal from "../../components/FilterModal";

import Card from "../../components/card";

function PlannerScreen({ navigation }) {
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [selectedLeaveType, setSelectedLeaveType] = useState("");
  const [searchName, setSearchName] = useState("");
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [role, setRole] = useState("");
  const [isApprover, setIsApprover] = useState(false);
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [comment, setComment] = useState("");
  const [date, setDate] = useState(new Date());
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [filterModalVisible, setfilterModalVisible] = useState(false);
  const months = Array.from({ length: 12 }, (_, monthIndex) => {
    const date = new Date(0, monthIndex);
    return date.toLocaleString("en-US", { month: "short" });
  });
  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const fetchLeaveRequests = async () => {
    try {
      const response = await axios.get("http://10.0.2.2:5000/leaverequest/all");
      const data = response.data;
      console.log(data);
      setRole(data.role);

      // If the user is an "approver," set all leave requests in the state.
      if (data.role === "approver") {
        const sortedLeaveRequests = data.leaverequests.sort((a, b) => {
          // Sort pending leave requests (status: "pending") before others
          if (a.status === "pending" && b.status !== "pending") {
            return -1;
          } else if (a.status !== "pending" && b.status === "pending") {
            return 1;
          }

          return 0;
        });

        setLeaveRequests(sortedLeaveRequests);
      } else {
        // If the user is an "employee," filter leave requests by status "accepted" only.
        const acceptedLeaveRequests = data.leaverequests.filter(
          (request) => request.status === "accepted"
        );
        setLeaveRequests(acceptedLeaveRequests);
      }

      setIsApprover(data.role === "approver");
    } catch (error) {
      console.log(error);
    }
  };
  const applyFilters = (filters) => {
    console.log("Applied filters:", filters);
    setSelectedStartDate(filters.date1);
    setSelectedEndDate(filters.date2);
    setSelectedLeaveType(filters.filterLeaveType);

    // Filter leaveRequests based on the selected criteria
    const filteredLeaveRequests = leaveRequests.filter((request) => {
      const startDate = new Date(request.startDate);

      // Set the time component of both dates to midnight
      const selectedStartDateAtMidnight = new Date(selectedStartDate);
      selectedStartDateAtMidnight.setHours(0, 0, 0, 0);
      startDate.setHours(0, 0, 0, 0);

      // Check if the start date is within the selected range
      const isWithinDateRange =
        (!selectedStartDate || startDate >= selectedStartDateAtMidnight) &&
        (!selectedEndDate || startDate <= selectedEndDate);

      // Check if the leave type matches the selected leave type (including "All" case)
      const isMatchingLeaveType =
        selectedLeaveType === "All" || request.leaveType === selectedLeaveType;

      return isWithinDateRange && isMatchingLeaveType;
    });

    // Update the leaveRequests state with the filtered list
    setLeaveRequests(filteredLeaveRequests);
  };

  // console.log(leaveRequests);
  function filterModalHandler() {
    setfilterModalVisible(true);
  }
  function closeFilterModal() {
    setfilterModalVisible(false);
  }

  const searchHandler = () => {
    if (searchName === "") {
      // If the search field is empty, fetch all leave requests again
      fetchLeaveRequests();
    } else {
      // If the search field is not empty, filter and display leave requests by name
      const filteredLeaveRequests = leaveRequests.filter((request) => {
        // Make the search case-insensitive
        const fullName = `${request.name} ${request.secondName}`.toLowerCase();
        return fullName.includes(searchName.toLowerCase());
      });

      // Update the leaveRequests state with the filtered list
      setLeaveRequests(filteredLeaveRequests);
    }
  };

  const refreshData = async () => {
    try {
      const response = await axios.get("http://10.0.2.2:5000/leaverequest/all");
      const data = response.data;
      console.log(data);
      setRole(data.role);

      // If the user is an "approver," set all leave requests in the state.
      if (data.role === "approver") {
        const sortedLeaveRequests = data.leaverequests.sort((a, b) => {
          // Sort pending leave requests (status: "pending") before others
          if (a.status === "pending" && b.status !== "pending") {
            return -1;
          } else if (a.status !== "pending" && b.status === "pending") {
            return 1;
          }

          return 0;
        });

        setLeaveRequests(sortedLeaveRequests);
      } else {
        // If the user is an "employee," filter leave requests by status "accepted" only.
        const acceptedLeaveRequests = data.leaverequests.filter(
          (request) => request.status === "accepted"
        );
        setLeaveRequests(acceptedLeaveRequests);
      }

      setIsApprover(data.role === "approver");
    } catch (error) {
      console.log(error);
    }
  };

  const handleRejectRequest = async () => {
    try {
      const response = await axios.put(
        `http://10.0.2.2:5000/leaverequest/update/${selectedLeave.id}`,
        { status: "rejected" }
      );

      if (response.status === 200) {
        console.log("Leave request rejected with comment:", comment);
        setModalIsVisible(false);
      } else {
        console.log("Failed to reject leave request");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleAccept = async () => {
    try {
      const response = await axios.put(
        `http://10.0.2.2:5000/leaverequest/update/${selectedLeave?.id}`,
        { status: "accepted" }
      );

      if (response.status === 200) {
        console.log("Leave request accepted");
        setModalIsVisible(false);
      } else {
        console.log("Failed to accept leave request");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCardPress = (item) => {
    setSelectedLeave(item);
    setModalIsVisible(true);
  };

  const renderLeaveRequest = ({ item }) => (
    <Pressable onPress={() => handleCardPress(item)}>
      <Card
        startDate={item.startDate.slice(8)}
        leaveType={item.leaveType}
        startMonth={months[Number(item.startDate.slice(5, -3)) - 1]}
        numberDays={item.numberDays}
        fullName={`${item.name} ${item.secondName}`}
        showTrashIcon={false}
        status={item.status}
        showDot={true}
      />
    </Pressable>
  );
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={filterModalHandler}>
          <Ionicons
            name="filter"
            size={25}
            color="#000000"
            style={{ fontSize: 40, fontWeight: "100" }}
          />
        </Pressable>
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <DateTimePicker mode="date" value={date} />
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name..."
          value={searchName}
          onChangeText={(text) => {
            setSearchName(text);
            searchHandler(text);
          }}
        />
        <View style={styles.iconsContainer}>
          <Ionicons
            name="search"
            size={30}
            color="#5fcbf9"
            style={styles.iconsContainer}
          />
        </View>
      </View>

      <FlatList
        data={leaveRequests}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderLeaveRequest}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={refreshData} />
        }
      />

      <Modal visible={modalIsVisible} transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Leave Request Details</Text>
            <View style={styles.detailsContainer}>
              <Text style={styles.detailLabel}>Employee Name:</Text>
              <Text style={styles.detailValue}>
                {`${selectedLeave?.name} ${selectedLeave?.secondName}`}
              </Text>
            </View>
            <View style={styles.detailsContainer}>
              <Text style={styles.detailLabel}>Leave Type:</Text>
              <Text style={styles.detailValue}>{selectedLeave?.leaveType}</Text>
            </View>
            <View style={styles.detailsContainer}>
              <Text style={styles.detailLabel}>Start Date:</Text>
              <Text style={styles.detailValue}>{selectedLeave?.startDate}</Text>
            </View>
            <View style={styles.detailsContainer}>
              <Text style={styles.detailLabel}>End Date:</Text>
              <Text style={styles.detailValue}>{selectedLeave?.endDate}</Text>
            </View>
            <View style={styles.detailsContainer}>
              <Text style={styles.detailLabel}>Number of Days:</Text>
              <Text style={styles.detailValue}>
                {selectedLeave?.numberDays}
              </Text>
            </View>
            <View style={styles.detailsContainer}>
              <Text style={styles.detailLabel}>Leave Duration:</Text>
              <Text style={styles.detailValue}>
                {selectedLeave?.leaveDuration}
              </Text>
            </View>
            {selectedLeave?.leaveDuration == "hourly" && (
              <>
                <View style={styles.detailsContainer}>
                  <Text style={styles.detailLabel}>Start Time:</Text>
                  <Text style={styles.detailValue}>
                    {selectedLeave?.startTime}
                  </Text>
                </View>
                <View style={styles.detailsContainer}>
                  <Text style={styles.detailLabel}>End Time:</Text>
                  <Text style={styles.detailValue}>
                    {selectedLeave?.endTime}
                  </Text>
                </View>
              </>
            )}
            {isApprover && (
              <>
                <Text style={styles.commentLabel}>Comment:</Text>
                <TextInput
                  style={styles.commentInput}
                  multiline
                  placeholder="Enter your comment..."
                  value={comment}
                  onChangeText={setComment}
                />
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.acceptButton}
                    onPress={handleAccept}
                  >
                    <Text style={styles.buttonText}>Accept</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.rejectButton}
                    onPress={handleRejectRequest}
                  >
                    <Text style={styles.buttonText}>Reject</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalIsVisible(false)}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <FilterModal
        isVisible={filterModalVisible}
        onClose={closeFilterModal}
        onApplyFilters={applyFilters}
      />
    </View>
  );
}

export default PlannerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    padding: 10,
  },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 20,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  detailsContainer: {
    flexDirection: "row",
    marginBottom: 10,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: 5,
    padding: 5,
  },
  detailLabel: {
    flex: 1,
    fontWeight: "bold",
    color: "#333",
  },
  detailValue: {
    flex: 2,
    color: "#333",
  },
  commentLabel: {
    marginTop: 10,
    fontWeight: "bold",
    color: "#333",
  },
  commentInput: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  acceptButton: {
    flex: 1,
    backgroundColor: "#20639b",
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  rejectButton: {
    flex: 1,
    backgroundColor: "#e63946",
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    marginLeft: 10,
  },
  closeButton: {
    backgroundColor: "#ccc",
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  searchContainer: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },

  searchInput: {
    flex: 1,
    paddingVertical: 10,
    paddingRight: 30,
    marginRight: 10,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderWidth: 0,
  },

  iconsContainer: {
    position: "absolute",
    right: 10,
    justifyContent: "center",
    height: "100%",
  },
});
