import React from "react";
import { Image } from "react-native";
import { TabNavigator, TabBarBottom, NavigationActions } from "react-navigation";
import { HomeTab, FeedTab, ExplorerTab, HeartTab, ProfileTab, EventTab, NotificationTab } from "./";
import ProfileIcon from "../components/ProfileIcon";
import NotificationIcon from "../components/NotificationIcon";
import navImages from "../config/navImages";

const TabContainer = TabNavigator(
  {
    HomeTab: {
      screen: HomeTab,
      navigationOptions: ({ navigation, screenProps }) => ({
        tabBarLabel: "Home",
        tabBarOnPress: ({ previousScene, scene, jumpToIndex }) => {
          const { route, focused, index } = scene;
          if (focused) {
            if (route.index > 0) {
              const tabRoute = route.routeName;
              const { routeName, key } = route.routes[0];
              navigation.dispatch(NavigationActions.navigate({ routeName: tabRoute }));
              navigation.dispatch(
                NavigationActions.reset({
                  index: 0,
                  key,
                  actions: [NavigationActions.navigate({ routeName })]
                })
              );
            } else {
              jumpToIndex(index);
            }
          } else {
            jumpToIndex(index);
          }
        },
        tabBarIcon: ({ tintColor, focused }) => <Image source={focused ? navImages.dashboard_on : navImages.dashboard_off} style={[styles.iconDash]} />
      })
    },
    EventTab: {
      screen: EventTab,
      navigationOptions: ({ navigation, screenProps }) => ({
        tabBarLabel: "Events",
        tabBarOnPress: ({ previousScene, scene, jumpToIndex }) => {
          const { route, focused, index } = scene;
          if (focused) {
            if (route.index > 0) {
              const tabRoute = route.routeName;
              const { routeName, key } = route.routes[0];
              navigation.dispatch(NavigationActions.navigate({ routeName: tabRoute }));
              navigation.dispatch(
                NavigationActions.reset({
                  index: 0,
                  key,
                  actions: [NavigationActions.navigate({ routeName })]
                })
              );
            } else {
              jumpToIndex(index);
            }
          } else {
            jumpToIndex(index);
          }
        },
        tabBarIcon: ({ tintColor, focused }) => <Image source={focused ? navImages.event_calendar_on : navImages.event_calendar_off} style={[styles.iconEvent]} />
      })
    },
    ExplorerTab: {
      screen: ExplorerTab,
      navigationOptions: ({ navigation, screenProps }) => ({
        tabBarLabel: "Camera",
        tabBarOnPress: ({ previousScene, scene, jumpToIndex }) => {
          const { route, focused, index } = scene;
          if (focused) {
            if (route.index > 0) {
              const tabRoute = route.routeName;
              const { routeName, key } = route.routes[0];
              navigation.dispatch(NavigationActions.navigate({ routeName: tabRoute }));
              navigation.dispatch(
                NavigationActions.reset({
                  index: 0,
                  key,
                  actions: [NavigationActions.navigate({ routeName })]
                })
              );
            } else {
              jumpToIndex(index);
            }
          } else {
            jumpToIndex(index);
          }
        },
        tabBarIcon: ({ tintColor, focused }) => <Image source={focused ? navImages.explorer_on : navImages.explorer_off} style={[styles.iconExplorer]} />
      })
    },
    NotificationTab: {
      screen: NotificationTab,
      navigationOptions: ({ navigation, screenProps }) => ({
        tabBarLabel: "Notification",
        tabBarOnPress: ({ previousScene, scene, jumpToIndex }) => {
          const { route, focused, index } = scene;
          if (focused) {
            if (route.index > 0) {
              const tabRoute = route.routeName;
              const { routeName, key } = route.routes[0];
              navigation.dispatch(NavigationActions.navigate({ routeName: tabRoute }));
              navigation.dispatch(
                NavigationActions.reset({
                  index: 0,
                  key,
                  actions: [NavigationActions.navigate({ routeName })]
                })
              );
            } else {
              jumpToIndex(index);
            }
          } else {
            jumpToIndex(index);
          }
        },
        tabBarIcon: ({ tintColor, focused, navigation }) => <NotificationIcon notifications={screenProps.notification_count} focused={focused} />
      })
    },
    ProfileTab: {
      screen: ProfileTab,
      navigationOptions: ({ navigation, screenProps }) => ({
        tabBarLabel: "Profile",
        tabBarOnPress: ({ previousScene, scene, jumpToIndex }) => {
          const { route, focused, index } = scene;
          if (focused) {
            if (route.index > 0) {
              const tabRoute = route.routeName;
              const { routeName, key } = route.routes[0];
              navigation.dispatch(NavigationActions.navigate({ routeName: tabRoute }));
              navigation.dispatch(
                NavigationActions.reset({
                  index: 0,
                  key,
                  actions: [NavigationActions.navigate({ routeName })]
                })
              );
            } else {
              jumpToIndex(index);
            }
          } else {
            jumpToIndex(index);
          }
        },
        tabBarIcon: ({ tintColor, focused }) => <ProfileIcon icon={screenProps.global.user_thumb} focused={focused} />
      })
    }
  },
  {
    tabBarPosition: "bottom",
    swipeEnabled: false,
    animationEnabled: false,
    initialRouteName: "HomeTab",
    tabBarOptions: {
      showIcon: true,
      showLabel: false,
      scrollEnabled: false,
      iconStyle: {
        width: 35,
        height: 35
      },
      indicatorStyle: {
        height: 0,
        width: 0
      },
      style: {
        backgroundColor: "#F8F8F8"
      }
    }
  }
);

const styles = {
  icon: {
    width: 28,
    height: 28,
    resizeMode: "contain"
  },
  iconDash: {
    width: 31,
    height: 31,
    resizeMode: "contain"
  },
  iconEvent: {
    width: 27,
    height: 27,
    resizeMode: "contain"
  },
  iconExplorer: {
    width: 32,
    height: 32,
    resizeMode: "contain"
  }
};

export default TabContainer;
