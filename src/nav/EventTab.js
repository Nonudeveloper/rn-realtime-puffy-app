import React from "react";
import { StackNavigator } from "react-navigation";
import routes from "../config/routes";
import { EventsHome } from "../scenes";

const EventTab = StackNavigator(
  {
    index: {
      screen: EventsHome
    },
    ...routes
  },
  {
    mode: "card",
    headerMode: "none"
  }
);

export { EventTab };
