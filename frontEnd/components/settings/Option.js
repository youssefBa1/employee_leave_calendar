import React from "react";
import { StyleSheet, Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  TouchableNativeFeedback,
  TouchableOpacity,
  Platform,
} from "react-native";

const Options = ({ name, iconName, onPressOption }) => {
  const TouchableComponent =
    Platform.OS === "android" ? TouchableNativeFeedback : TouchableOpacity;

  return (
    <TouchableComponent onPress={onPressOption}>
      <View style={styles.optionContainer}>
        <Ionicons name={iconName} size={28} color="#000" style={styles.icon} />
        <Text style={styles.optionText}>{name}</Text>
      </View>
    </TouchableComponent>
  );
};

export default Options;

const styles = StyleSheet.create({
  optionContainer: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginVertical: 10,
    marginHorizontal: 10, // Add margin to the left and right edges
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  icon: {
    marginRight: 40, // Adjust the margin to make the icon closer to the text
  },
  optionText: {
    fontSize: 18,
    fontFamily: "Arial",
    color: "#000",
    flex: 1, // To center the text within the Pressable
  },
});
