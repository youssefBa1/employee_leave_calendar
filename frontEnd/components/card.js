import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import CustomHeaderButton from "./CustomHeaderButton";

function Card({
  startDate,
  startMonth,
  leaveType,
  numberDays,
  fullName,
  onDelete,
  showTrashIcon = true,

  status,
  showDot = false,
}) {
  const getStatusCircleColor = () => {
    if (status === "accepted") {
      return "#82e0ab";
    } else if (status === "rejected") {
      return "#f03924";
    } else {
      return "#ffbf00";
    }
  };

  return (
    <View style={styles.cardContainer}>
      {showDot &&
        status && ( // Conditionally render the status circle if showDot and status are true
          <View
            style={[
              styles.statusCircle,
              { backgroundColor: getStatusCircleColor() },
            ]}
          />
        )}

      <View style={styles.startDateContainer}>
        <Text style={styles.dateText}>{startDate}</Text>
        <Text style={styles.monthText}>{startMonth}</Text>
      </View>
      <View style={styles.leaveDetailsContainer}>
        <Text style={styles.typeText}>{leaveType}</Text>
        <Text style={styles.daysText}>{numberDays + " days"}</Text>
        <Text style={styles.name}>{fullName}</Text>
      </View>
      {showTrashIcon && (
        <View style={styles.iconsContainer}>
          <Ionicons name="trash" size={24} color="#ff0000" onPress={onDelete} />
        </View>
      )}
    </View>
  );
}

export default Card;

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 15,
    marginHorizontal: 10,
    flexDirection: "row",
    height: 80,
    marginVertical: 10,
    padding: 10,
    alignItems: "center",
    backgroundColor: "#e1e1e1", // Default background color
    borderWidth: 1,
    borderColor: "#dcdcdc", // Default border color
  },
  statusCircle: {
    position: "absolute",
    top: 5,
    right: 5,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  startDateContainer: {
    borderWidth: 2,
    borderColor: "#5fcbf9",
    borderRadius: 8,
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  dateText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#5fcbf9",
  },
  monthText: {
    fontSize: 12,
    color: "#5fcbf9",
  },
  leaveDetailsContainer: {
    flex: 1,
    marginLeft: 10,
  },
  typeText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
  },
  daysText: {
    fontSize: 14,
    color: "#666666",
  },
  name: {
    color: "#0d1586",
  },
  iconsContainer: {
    flexDirection: "column",
    alignItems: "center",
  },
});
