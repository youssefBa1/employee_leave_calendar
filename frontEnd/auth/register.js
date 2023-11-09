import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
} from "react-native";
import axios from "axios";

const LoginForm = ({ handleLogin, setIsSignedIn, navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [secondName, setSecondName] = useState("");

  const handleLoginButton = () => {
    // Email validation regex pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      Alert.alert("Invalid email address");
      return;
    }

    axios
      .post("http://10.0.2.2:5000/register", {
        password,
        email,
        name,
        secondName,
      })
      .then((response) => {
        Alert.alert("Registered successfully");
      })
      .catch((error) => {
        Alert.alert("An error occurred. Please try again later.");
      });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#a6c5d9"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#a6c5d9"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TextInput
        style={styles.input}
        placeholder="Name"
        placeholderTextColor="#a6c5d9"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Secondname"
        placeholderTextColor="#a6c5d9"
        value={secondName}
        onChangeText={setSecondName}
      />
      <TouchableOpacity style={styles.button} onPress={handleLoginButton}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "#ffffff",
  },
  input: {
    height: 40,
    borderColor: "#a6c5d9",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 10,
    color: "#333",
  },
  button: {
    backgroundColor: "#367fa9",
    paddingVertical: 12,
    borderRadius: 5,
  },
  buttonText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  registerText: {
    textAlign: "center",
    color: "#0099ff",
    marginTop: 10,
  },
});
