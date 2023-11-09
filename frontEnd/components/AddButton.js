import { Children } from "react";
import { View, Text, StyleSheet, Pressable, Moda } from "react-native";

function AddButton({ children, onPress }) {
  return (
    <View style={styles.buttonOutterContainer}>
      <Pressable
        onPress={onPress}
        android_ripple={{ color: "#1373d4" }}
        style={styles.buttonInnerContainer}
      >
        <Text style={styles.buttonText}>{children}</Text>
      </Pressable>
    </View>
  );
}

function CancelButton({ children, onPress }) {
  return (
    <View style={styles.buttonOutterContainer}>
      <Pressable
        onPress={onPress}
        android_ripple={{ color: "#1373d4" }}
        style={styles.buttonInnerContainer}
      >
        <Text style={styles.buttonText}>{children}</Text>
      </Pressable>
    </View>
  );
}

export default AddButton;

const styles = StyleSheet.create({
  buttonOutterContainer: {
    overflow: "hidden",
    borderRadius: 20,
    margin: 8,
    marginRight: 30,
  },
  buttonInnerContainer: {
    backgroundColor: "#3ea2ee",
    paddingHorizontal: 8,
    paddingVertical: 16,
  },
  buttonText: {
    textAlign: "center",
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
});
