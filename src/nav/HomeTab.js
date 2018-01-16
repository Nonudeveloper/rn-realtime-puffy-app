import React from "react";
import { StackNavigator } from "react-navigation";
import routes from "../config/routes";
import { Home } from "../scenes";

const HomeTab = StackNavigator(
  {
    index: {
      screen: Home
    },
    ...routes
  },
  {
    mode: "card",
    headerMode: "none"
  }
);

export { HomeTab };
