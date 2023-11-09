import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
} from "react-native";
import axios from "axios";

function UserListScreen() {
  const [userRole, setUserRole] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUserRole();
    fetchUsers();
  }, []);

  const fetchUserRole = async () => {
    try {
      const response = await axios.get("http://10.0.2.2:5000/user");
      setUserRole(response.data.role);
      console.log("User role is set");
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://10.0.2.2:5000/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleModifyRole = (userId, currentRole) => {
    const availableRoles = ["employee", "approver", "cancel"];
    Alert.alert(
      "Modify Role",
      "Choose the new role for the user:",
      [
        ...availableRoles.map((role) => ({
          text: role.charAt(0).toUpperCase() + role.slice(1),
          onPress: () => updateRole(userId, currentRole, role),
        })),
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  const updateRole = (userId, currentRole, newRole) => {
    if (newRole === "cancel") {
      return;
    }

    axios
      .put(`http://10.0.2.2:5000/users/update/${userId}`, { role: newRole })
      .then((response) => {
        const updatedUsers = users.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        );
        setUsers(updatedUsers);
        Alert.alert(
          "Role Updated",
          `User's role has been updated to ${newRole}.`
        );
      })
      .catch((error) => {
        console.error("Error updating user's role:", error);
      });
  };

  const deleteUser = (userId, role) => {
    if (role === "approver") {
      Alert.alert(
        "Cannot Delete Approver",
        "Users with the role 'approver' cannot be deleted."
      );
      return;
    }

    Alert.alert(
      "Delete User",
      "Are you sure you want to delete this user?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            axios
              .delete(`http://10.0.2.2:5000/users/delete/${userId}`)
              .then((response) => {
                setUsers(users.filter((user) => user.id !== userId));
                Alert.alert(
                  "User Deleted",
                  "The user has been deleted successfully."
                );
              })
              .catch((error) => {
                console.error("Error deleting user:", error);
              });
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.userRow}>
      <Text style={styles.userName}>
        {item.name} {item.secondName}
      </Text>
      <Text style={styles.userEmail}>{item.email}</Text>
      <Text style={styles.userRole}>Role: {item.role}</Text>
      {!isEmployee && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => handleModifyRole(item.id, item.role)}
            style={styles.modifyButton}
          >
            <Text style={styles.modifyButtonText}>Modify Role</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => deleteUser(item.id, item.role)}
            style={styles.deleteButton}
          >
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const isEmployee = userRole === "employee";

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  userRow: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  userRole: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
  },
  modifyButton: {
    flex: 1,
    backgroundColor: "#3ea2ee",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginRight: 10,
  },
  modifyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  deleteButton: {
    flex: 1,
    backgroundColor: "#e34a4a",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default UserListScreen;
