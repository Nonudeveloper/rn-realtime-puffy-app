import React from "react";
import { StackNavigator } from "react-navigation";
import routes from "../config/routes";
import { MyProfile } from "../scenes";

const ProfileTab = StackNavigator(
  {
    index: {
      screen: MyProfile
    },
    ...routes
  },
  {
    mode: "card",
    headerMode: "none"
  }
);

export { ProfileTab };
