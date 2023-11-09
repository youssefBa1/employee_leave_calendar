import React, { useState, useEffect } from "react";
import {
  View,
  Modal,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList,
  ScrollView,
  Pressable,
  RefreshControl,
} from "react-native";
import moment from "moment";
import { Calendar } from "react-native-calendars";
import { Ionicons } from "@expo/vector-icons";
import AddButton from "../../components/AddButton";
import LeaveRequestForm from "../../components/form";
import Card from "../../components/card";
import axios from "axios";
import DateHolidays from "date-holidays";

const MyLeavesScreen = ({ navigation }) => {
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [selectedDays, setSelectedDays] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [leaveData, setLeaveData] = useState([]);
  const [selected, setSelected] = useState(false);
  const [selectedDatesCount, setSelectedDatesCount] = useState(0);
  const [selectedLeaveRequest, setSelectedLeaveRequest] = useState(null);
  const [tunisiaHolidays, setTunisiaHolidays] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [currentDate, setCurrentDate] = useState(
    moment().subtract(1, "days").toDate()
  );
  const months = Array.from({ length: 12 }, (_, monthIndex) => {
    const date = new Date(0, monthIndex);
    return date.toLocaleString("en-US", { month: "short" });
  });

  const [totalLeaveDays, setTotalLeaveDays] = useState(0);
  const [totalLeaveDaysAccepted, setTotalLeaveDaysAccepted] = useState(0);

  useEffect(() => {
    fetchLeaveData();
    setSelectedStatus("all");
    fetchTunisiaHolidays();
    fetchLeaveData();
  }, []);

  const fetchTunisiaHolidays = () => {
    const hd = new DateHolidays("TN");
    const year = new Date().getFullYear();
    const holidays = hd.getHolidays(year);
    const tunisiaHolidays = holidays.map((holiday) => holiday.date);
    setTunisiaHolidays(tunisiaHolidays);
  };

  const fetchLeaveData = async () => {
    try {
      const response = await axios.get(
        "http://10.0.2.2:5000/leaverequest/myleaverequest"
      );
      const data = response.data;
      setLeaveData(data);

      // Calculate the total leave days of accepted requests
      const totalLeaveDays = data.reduce((totalDays, request) => {
        if (request.status === "accepted") {
          return totalDays + request.numberDays;
        }
        return totalDays;
      }, 0);

      setTotalLeaveDaysAccepted(totalLeaveDays);

      setTotalLeaveDays(totalLeaveDaysAccepted);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteLeaveRequest = async (id) => {
    try {
      await axios.delete(`http://10.0.2.2:5000/leaverequest/delete/${id}`);
      fetchLeaveData();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectLeaveRequest = (item) => {
    setSelectedLeaveRequest(item);
    setSelectedStartDate(item.startDate);
    setSelectedEndDate(item.endDate);
    setShowUpdateModal(true);
  };

  const handleSubmitModifiedLeave = async (formData) => {
    const modifiedLeaveData = {
      id: selectedLeaveRequest.id,
      startDate: selectedStartDate,
      endDate: selectedEndDate,
      ...formData,
    };

    try {
      await axios.put(
        `http://10.0.2.2:5000/leaverequest/update/${modifiedLeaveData.id}`,
        modifiedLeaveData
      );
      fetchLeaveData();
      setShowUpdateModal(false);
    } catch (error) {
      console.log(error);
      Alert.alert("Error updating leave request");
    }
  };

  const handleDayPress = (day) => {
    const { dateString } = day;

    const selectedDayOfWeek = new Date(dateString).getDay();
    if (selectedDayOfWeek === 0 || selectedDayOfWeek === 6) {
      return;
    }

    const isHoliday = tunisiaHolidays.includes(dateString);
    if (isHoliday) {
      return;
    }

    const updatedSelectedDays = { ...selectedDays };

    if (selectedDays[dateString]) {
      delete updatedSelectedDays[dateString];
    } else {
      updatedSelectedDays[dateString] = { selected: true };
    }

    const sortedSelectedDates = Object.keys(updatedSelectedDays).sort();

    let newStartDate = null;
    let newEndDate = null;

    if (sortedSelectedDates.length > 0) {
      newStartDate = sortedSelectedDates[0];
      newEndDate = sortedSelectedDates[sortedSelectedDates.length - 1];
    }

    const daysBetween = getDaysBetween(newStartDate, newEndDate);

    daysBetween.forEach((date) => {
      const dayOfWeek = new Date(date).getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        updatedSelectedDays[date] = { selected: true };
      }
    });

    setSelectedStartDate(newStartDate);
    setSelectedEndDate(newEndDate);
    setSelectedDays(updatedSelectedDays);
    setSelectedDatesCount(daysBetween.length);
  };

  const getDaysBetween = (startDate, endDate) => {
    if (!startDate || !endDate) {
      return [];
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const daysBetween = [];

    for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
      daysBetween.push(new Date(date).toISOString().slice(0, 10));
    }

    return daysBetween;
  };

  const isSelected = () => {
    if (selectedDays) setSelected(true);
  };

  const handleAddLeave = () => {
    setShowModal(true);
  };

  const clearSelectedDates = () => {
    setSelectedDays({});
    setSelectedStartDate(null);
    setSelectedEndDate(null);
    setSelectedDatesCount(0);
  };

  const handleSubmitLeave = (formData) => {
    const leaveData = {
      startDate: selectedStartDate,
      endDate: selectedEndDate,
      ...formData,
    };

    Alert.alert("Leave request submitted successfully");

    setShowModal(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setShowUpdateModal(false);
  };

  const handleStatusFilter = (status) => {
    setSelectedStatus(status);
  };

  const filteredLeaveData =
    selectedStatus === "all"
      ? leaveData
      : leaveData.filter((data) => data.status === selectedStatus);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleAddLeave}>
          <Ionicons
            name="add-circle-outline"
            size={30}
            color="#5fcbf9"
            style={{ fontSize: 40, fontWeight: "100" }}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);
  const refreshData = async () => {
    try {
      const response = await axios.get(
        "http://10.0.2.2:5000/leaverequest/myleaverequest"
      );
      const data = response.data;
      setLeaveData(data);

      // Calculate the total leave days of accepted requests
      const totalLeaveDays = data.reduce((totalDays, request) => {
        if (request.status === "accepted") {
          return totalDays + request.numberDays;
        }
        return totalDays;
      }, 0);

      setTotalLeaveDaysAccepted(totalLeaveDays);
      setTotalLeaveDays(totalLeaveDays);
    } catch (error) {
      console.log(error);
    }
  };

  const renderLeaveRequest = ({ item }) => (
    <Pressable
      onPress={() =>
        item.status === "pending" ? handleSelectLeaveRequest(item) : null
      }
    >
      <Card
        startDate={item.startDate ? item.startDate.slice(8) : "N/A"}
        leaveType={item.leaveType}
        startMonth={
          item.startDate
            ? months[Number(item.startDate.slice(5, -3)) - 1]
            : "N/A"
        }
        numberDays={item.numberDays}
        fullName={`${item.name} ${item.secondName}`}
        onDelete={() => handleDeleteLeaveRequest(item.id)}
        showTrashIcon={item.status === "pending"}
      />
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.totalLeaveDaysContainer}>
        <Text style={styles.totalLeaveDaysText}>
          Total Leave Days: {totalLeaveDays}
        </Text>
      </View>

      <View style={styles.filterOptions}>
        <TouchableOpacity
          style={[
            styles.filterOption,
            selectedStatus === "all" && styles.selectedFilterOption,
          ]}
          onPress={() => handleStatusFilter("all")}
        >
          <Text style={styles.filterOptionText}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterOption,
            selectedStatus === "pending" && styles.selectedFilterOption,
          ]}
          onPress={() => handleStatusFilter("pending")}
        >
          <Text style={styles.filterOptionText}>Pending</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterOption,
            selectedStatus === "accepted" && styles.selectedFilterOption,
          ]}
          onPress={() => handleStatusFilter("accepted")}
        >
          <Text style={styles.filterOptionText}>Accepted</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterOption,
            selectedStatus === "rejected" && styles.selectedFilterOption,
          ]}
          onPress={() => handleStatusFilter("rejected")}
        >
          <Text style={styles.filterOptionText}>Rejected</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredLeaveData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderLeaveRequest}
        refreshControl={
          <RefreshControl
            refreshing={false} // Set this to true when data is being refreshed
            onRefresh={refreshData}
          />
        }
      />

      <Modal
        visible={showModal || showUpdateModal}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.formContainer}>
              <LeaveRequestForm
                onSubmit={handleSubmitLeave}
                onCancel={handleCloseModal}
                endDateC={selectedEndDate}
                startDateC={selectedStartDate}
                selected={selected}
                numberDays={selectedDatesCount}
                leaveRequestData={selectedLeaveRequest}
                showUpdateModal={showUpdateModal}
              />
            </View>

            <View style={styles.calendarContainer}>
              <Calendar
                style={styles.calendar}
                onDayPress={handleDayPress}
                markedDates={selectedDays}
                minDate={currentDate}
              />

              <AddButton onPress={clearSelectedDates}>Clear</AddButton>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
    marginBottom: 10,
  },
  filterOption: {
    padding: 10,
    borderRadius: 5,
  },
  selectedFilterOption: {
    backgroundColor: "#5fcbf9",
    borderRadius: 28,
  },
  filterOptionText: {
    color: "#000000",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  formContainer: {
    flex: 2,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: "center",
  },
  calendarContainer: {
    flex: 3,
  },
  calendar: {
    marginHorizontal: 30,
    marginVertical: 25,
    borderRadius: 10,
  },
  totalLeaveDaysContainer: {
    padding: 10,
    alignItems: "center",
  },
  totalLeaveDaysText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default MyLeavesScreen;
