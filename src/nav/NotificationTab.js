import React from "react";
import { StackNavigator } from "react-navigation";
import routes from "../config/routes";
import { Notification } from "../scenes";

const NotificationTab = StackNavigator(
  {
    index: {
      screen: Notification
    },
    ...routes
  },
  {
    mode: "card",
    headerMode: "none"
  }
);

export { NotificationTab };

