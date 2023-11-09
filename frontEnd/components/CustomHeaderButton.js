import React from "react";
import { HeaderButton } from "react-navigation-header-buttons";
import { Ionicons } from "@expo/vector-icons";

function CustomHeaderButton(props) {
  return (
    <HeaderButton
      {...props}
      IconComponent={"MaterialIcons"}
      iconSize={23}
      color="blue"
    />
  );
}

export default CustomHeaderButton;
