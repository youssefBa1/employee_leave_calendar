import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";

// Screens
import MyLeavesScreen from "./screens/MyLeavesScreen.js";
import PlannerScreen from "./screens/PlannerScreen.js";
import SettingsScreen from "./screens/SettingsScreen";
import TableScreen from "./screens/Table.js";

// Screen names
const myLeaves = "myleaves";
const planner = "planner";
const settingsName = "Settings";
const TableScreenN = "Table";
const Tab = createBottomTabNavigator();

function MainContainer({ handleLogout }) {
  return (
    <Tab.Navigator
      initialRouteName={myLeaves}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let rn = route.name;

          if (rn === myLeaves) {
            iconName = focused ? "cafe-outline" : "cafe-outline";
          } else if (rn === planner) {
            iconName = focused ? "calendar" : "calendar";
          } else if (rn === settingsName) {
            iconName = focused ? "settings" : "settings-outline";
          } else if (rn === TableScreenN) {
            iconName = focused ? "Table" : "settings-outline";
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#3ea2ee",
        tabBarInactiveTintColor: "grey",
        tabBarLabelStyle: { paddingBottom: 10, fontSize: 10 },
        tabBarStyle: { padding: 10, height: 70 },
      })}
    >
      <Tab.Screen name={myLeaves} component={MyLeavesScreen} />
      <Tab.Screen name={planner} component={PlannerScreen} />
      <Tab.Screen
        name={settingsName}
        options={{ headerShown: true }}
        component={() => (
          <SettingsScreen handleLogout={handleLogout} navigation={navigator} />
        )}
      />
      <Tab.Screen name={TableScreenN} component={TableScreen} />
    </Tab.Navigator>
  );
}

export default MainContainer;
