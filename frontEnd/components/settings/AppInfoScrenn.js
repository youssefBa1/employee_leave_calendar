import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

const AppInfoScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.section}>
        <Text style={styles.title}>MyLeaves Screen</Text>
        <Text style={styles.infoText}>
          <Text style={styles.role}>Employee Role:</Text> Responsible for
          submitting a new leave request by clicking on the plus button. To
          modify a leave request, click on the request with the status set to
          "Pending". Leave requests with status "Pending" can be deleted.
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.role}>Approver Role:</Text> Responsible for
          submitting a new leave request by clicking on the plus button. To
          modify a leave request, click on the request with the status set to
          "Pending". Leave requests with status "Pending" can be deleted.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Planner Screen</Text>
        <Text style={styles.infoText}>
          <Text style={styles.role}>Employee Role:</Text> Displays accepted
          leave requests from colleagues. When clicking on a request, further
          details are shown.
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.role}>Approver Role:</Text> Displays all leave
          requests. By clicking on a leave request, the approver can accept or
          reject the request. Different status will have different dot colors.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Settings Screen for Approver</Text>
        <Text style={styles.infoText}>
          <Text style={styles.role}>Approver Role:</Text>
        </Text>
        <Text style={styles.infoText}>
          In the Settings screen, the approver can perform the following
          actions:
        </Text>
        <Text style={styles.subInfoText}>
          - Create new leave types and update current leave types. By default,
          three leave types will be provided.
        </Text>
        <Text style={styles.subInfoText}>
          - Display all users with their information. The approver can delete or
          modify their roles. Note that a user with the role "Approver" cannot
          be deleted to prevent not having an approver in the app. To delete an
          approver, assign a new approver first, then switch the desired user's
          role to "Approver" and delete it.
        </Text>
        <Text style={styles.subInfoText}>
          - Delete handled leave requests, which include accepted and rejected
          leave requests. This option is included in the app to prevent past
          leave requests from stacking. Note that this action is irreversible,
          so make sure to use it sparingly (e.g., once a year) because leave
          request data is used to calculate the users' number of leave days.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  section: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e1e1e1",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 10,
  },
  subInfoText: {
    fontSize: 16,
    marginBottom: 5,
    marginLeft: 20,
  },
  role: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
});

export default AppInfoScreen;
