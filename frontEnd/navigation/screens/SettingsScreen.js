import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, FlatList } from "react-native";
import axios from "axios";
import { Alert } from "react-native";
import Options from "../../components/settings/Option";
import LeavesOptionsScreen from "../../components/settings/LeaveOptionsScreen";
import UserListScreen from "../../components/settings/UserListScreen";
import AppInfoScreen from "../../components/settings/AppInfoScrenn";

function SettingsScreen({ handleLogout }) {
  const [isLeavesOptionClicked, setIsLeavesOptionClicked] = useState(false);
  const [isUsersListClicked, setIsUsersListClicked] = useState(false);
  const [isAppInfoClicked, setIsAppInfoClicked] = useState(false);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    fetchUserRole();
  }, []);

  const handleLogoutPress = () => {
    axios
      .post("http://10.0.2.2:5000/logout")
      .then((response) => {
        console.log("Logged out successfully");
        handleLogout();
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  };

  const handleDeletePress = () => {
    Alert.alert(
      "Delete Handled Requests",
      "This action will permanently delete all handled leave requests. Are you sure you want to proceed?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            axios
              .delete("http://10.0.2.2:5000/leaverequest/handeled")
              .then((response) => {
                console.log("Deleted handled requests successfully");
              })
              .catch((error) => {
                console.error("Error deleting handled requests:", error);
              });
          },
        },
      ]
    );
  };

  const fetchUserRole = async () => {
    axios
      .get("http://10.0.2.2:5000/user")
      .then((response) => {
        setUserRole(response.data.role);
        console.log("user role is set");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const optionsData = [
    {
      id: "1",
      name: "Leave Options",
      iconName: "calendar",
    },
    {
      id: "2",
      name: "Users List",
      iconName: "people-outline",
    },
    { id: "3", name: "Delete Handled Requests", iconName: "trash-outline" },
    {
      id: 4,
      name: "App Info",
      iconName: "information-circle-outline",
    },
  ];

  const handleOptionPress = (optionName) => {
    if (optionName === "Leave Options" && userRole === "approver") {
      setIsLeavesOptionClicked(true);
      setIsUsersListClicked(false);
      setIsAppInfoClicked(false);
    } else if (optionName === "Users List") {
      setIsLeavesOptionClicked(false);
      setIsUsersListClicked(true);
      setIsAppInfoClicked(false);
    } else if (
      optionName === "Delete Handled Requests" &&
      userRole === "approver"
    ) {
      handleDeletePress();
    } else if (optionName === "App Info") {
      setIsLeavesOptionClicked(false);
      setIsUsersListClicked(false);
      setIsAppInfoClicked(true);
    }
  };

  const handleBackPress = () => {
    setIsLeavesOptionClicked(false);
    setIsUsersListClicked(false);
    setIsAppInfoClicked(false);
  };

  const renderItem = ({ item }) => {
    if (
      userRole !== "approver" &&
      (item.name === "Leave Options" || item.name === "Delete Handled Requests")
    ) {
      return null;
    }

    return (
      <Options
        name={item.name}
        iconName={item.iconName}
        onPressOption={() => handleOptionPress(item.name)}
      />
    );
  };

  if (isLeavesOptionClicked) {
    return <LeavesOptionsScreen handleBackPress={handleBackPress} />;
  }

  if (isUsersListClicked) {
    return <UserListScreen handleBackPress={handleBackPress} />;
  }

  if (isAppInfoClicked) {
    return <AppInfoScreen handleBackPress={handleBackPress} />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={optionsData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />

      <Pressable style={styles.signoutContainer} onPress={handleLogoutPress}>
        <Text style={styles.signoutText}>Logout</Text>
      </Pressable>
    </View>
  );
}

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  signoutContainer: {
    marginTop: 25,
    borderRadius: 10,
    padding: 15,
    backgroundColor: "#e34a4a",
    alignSelf: "center",
  },
  signoutText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#f2f2f2",
  },
});
