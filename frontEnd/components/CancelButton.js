import { Children } from "react";
import { View, Text, StyleSheet, Pressable, Moda } from "react-native";

function CancelButton({ children, onPress }) {
  return (
    <View style={styles.buttonOutterContainer}>
      <Pressable
        onPress={onPress}
        android_ripple={{ color: "#810000" }}
        style={styles.buttonInnerContainer}
      >
        <Text style={styles.buttonText}>{children}</Text>
      </Pressable>
    </View>
  );
}

export default CancelButton;

const styles = StyleSheet.create({
  buttonOutterContainer: {
    overflow: "hidden",
    borderRadius: 20,
    margin: 8,
  },
  buttonInnerContainer: {
    backgroundColor: "#ee3e3e",
    paddingHorizontal: 8,
    paddingVertical: 16,
    elevation: 7,
  },
  buttonText: {
    textAlign: "center",
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
});
