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

  const handleLoginButton = () => {
    axios
      .post("http://10.0.2.2:5000/login", {
        password,
        email,
      })
      .then((response) => {
        console.log(response);
        // Handle successful form submission
        Alert.alert("Logged in");
        handleLogin(); // Call handleLogin to update isSignedIn to true
      })
      .catch((error) => {
        // Handle form submission error
        Alert.alert("Incorrect email or password");
      });
  };

  const handleRegister = () => {
    navigation.navigate("register"); // Navigate to the registration screen
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
      <TouchableOpacity style={styles.button} onPress={handleLoginButton}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleRegister}>
        <Text style={styles.registerText}>Don't have an account? Register</Text>
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
    borderRadius: 5,
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
