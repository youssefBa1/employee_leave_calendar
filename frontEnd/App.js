import React, { useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

import MainContainer from "./navigation/mainContainer";
import LoginForm from "./auth/login.js";
import RegisterForm from "./auth/register";
import { LogBox } from "react-native";
LogBox.ignoreAllLogs();

const Stack = createStackNavigator();

export default function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);

  const handleLogin = () => {
    setIsSignedIn(true); // Set isSignedIn to true after successful login
  };

  const handleLogout = () => {
    setIsSignedIn(false); // Set isSignedIn to false upon logout
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isSignedIn ? (
          <Stack.Screen
            name="main"
            component={() => <MainContainer handleLogout={handleLogout} />}
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Stack.Screen
              name="LogIn"
              component={({ navigation }) => (
                <LoginForm
                  handleLogin={handleLogin}
                  setIsSignedIn={setIsSignedIn}
                  navigation={navigation} // Pass the navigation prop to the LoginForm component
                />
              )}
            />
            <Stack.Screen name="register" component={RegisterForm} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
