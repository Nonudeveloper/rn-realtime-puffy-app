import React from "react";
import { StackNavigator } from "react-navigation";
import routes from "../config/routes";
import { Feed } from "../scenes";

const FeedTab = StackNavigator(
  {
    index: {
      screen: Feed
    },
    ...routes
  },
  {
    mode: "card",
    headerMode: "none"
  }
);

export { FeedTab };
