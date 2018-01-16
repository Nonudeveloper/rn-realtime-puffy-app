import React from "react";
import { StackNavigator } from "react-navigation";
import routes from "../config/routes";
import { ExplorerHome } from "../scenes";

const ExplorerTab = StackNavigator(
  {
    index: {
      screen: ExplorerHome
    },
    ...routes
  },
  {
    mode: "card",
    headerMode: "none"
  }
);

export { ExplorerTab };

