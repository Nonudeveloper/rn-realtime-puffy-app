"use strict";
import React, { Component } from "react";
import { PanResponder, Dimensions, Animated, Text } from "react-native";

const { height, width } = Dimensions.get("window");

export default class Card extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pan: new Animated.ValueXY(),
      panDistance: new Animated.Value(0),
      showLabelLeft: false,
      showLabelRight: false
    };

    this.swipeLeft = this.swipeLeft.bind(this);
    this.swipeRight = this.swipeRight.bind(this);
    this.swipeCard = this.swipeCard.bind(this);
  }

  swipeLeft() {
    this.swipeCard("Left", -width);
  }

  swipeRight() {
    this.swipeCard("Right", width);
  }

  swipeCard(direction, x) {
    if (direction == "Left") {
      this.setState({
        showLabelLeft: true,
        showLabelRight: false
      });
    } else {
      this.setState({
        showLabelLeft: false,
        showLabelRight: true
      });
    }
    Animated.spring(this.state.panDistance, {
      toValue: 220
    }).start();

    Animated.timing(this.state.pan, {
      toValue: { x: x, y: 0 },
      duration: 500
    }).start(() => {
      //  console.log(direction);
      if (direction == "Left") {
        //console.log("swipping left");
        this.props.onSwipeLeft(this.props.item);
      } else {
        this.props.onSwipeRight(this.props.item);
      }
    });
  }

  onPanResponderMove = (event, gestureState) => {
    return Animated.event([null, { dx: this.state.pan.x, dy: 0 }]);
  };

  componentWillMount() {
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetResponderCapture: () => false,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
        const isVerticalSwipe = Math.sqrt(Math.pow(gestureState.dx, 2) < Math.pow(gestureState.dy, 2));
        if (isVerticalSwipe) {
          return false;
        }
        if (this.props.disable === true) {
          return false;
        }
        return Math.sqrt(Math.pow(gestureState.dx, 2) + Math.pow(gestureState.dy, 2)) > 10;
      },
      onPanResponderGrant: (e, gestureState) => {
        this.state.pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: (e, gestureState) => {
        if (this.state.pan.x._value > 5) {
          this.setState({
            showLabelRight: true,
            showLabelLeft: false
          });
        } else if (this.state.pan.x._value < -5) {
          this.setState({
            showLabelRight: false,
            showLabelLeft: true
          });
        }

        Animated.event([null, { dx: this.state.pan.x, dy: 0 }])(e, gestureState);
      },
      onPanResponderRelease: (e, { vx, vy }) => {
        if (this.state.pan.x._value < this.props.onSwipeLeftThreshold) {
          this.props.onSwipeLeft(this.props.item);
        } else if (this.state.pan.x._value > this.props.onSwipeRightThreshold) {
          this.props.onSwipeRight(this.props.item);
        } else {
          this.setState({
            showLabelRight: false,
            showLabelLeft: false
          });
          Animated.spring(this.state.pan, {
            toValue: 0
          }).start();
        }
      }
    });
  }

  componentWillUnmount() {
    this.state.pan.x.removeAllListeners();
    this.state.pan.y.removeAllListeners();
  }

  getAnimatedViewStyle(index) {
    //console.log(this.props.cardList);
    let { pan } = this.state;
    return [
      { position: "absolute" },
      { left: 5 },
      { right: 5 },
      { top: 0 },
      { bottom: 12 },
      {
        transform: [
          { translateX: pan.x },
          { translateY: pan.y },
          {
            rotate: pan.x.interpolate({
              inputRange: [this.props.leftSwipeThreshold, 0, this.props.rightSwipeThreshold],
              outputRange: [`-${this.props.cardRotation}deg`, "0deg", `${this.props.cardRotation}deg`]
            })
          }
        ]
      },
      {
        opacity: pan.x.interpolate({
          inputRange: [this.props.leftSwipeThreshold, 0, this.props.rightSwipeThreshold],
          outputRange: [this.props.cardOpacity, 1, this.props.cardOpacity]
        })
      }
    ];
  }

  getNonAnimatedViewStyle(index) {
    //console.log(this.props.cardList);
    let { pan } = this.state;
    return [
      { position: "absolute" },
      { left: 5 },
      { right: 5 },
      { top: 0 },
      { bottom: 12 },
      {
        opacity: pan.x.interpolate({
          inputRange: [this.props.leftSwipeThreshold, 0, this.props.rightSwipeThreshold],
          outputRange: [this.props.cardOpacity, 1, this.props.cardOpacity]
        })
      }
    ];
  }

  render() {
    if (this.props.index === this.props.cardList.length - 1) {
      return (
        <Animated.View style={this.getAnimatedViewStyle(this.props.index)} {...this.panResponder.panHandlers}>
          {this.props.renderCard(this.props.item)}
          {this.state.showLabelLeft === true ? this.props.leftLabel : null}
          {this.state.showLabelRight === true ? this.props.rightLabel : null}
        </Animated.View>
      );
    } else if (this.props.index === this.props.cardList.length - 2) {
      return <Animated.View style={this.getNonAnimatedViewStyle(this.props.index)}>{this.props.renderCard(this.props.item)}</Animated.View>;
    } else if (this.props.index === this.props.cardList.length - 3) {
      return <Animated.View style={this.getNonAnimatedViewStyle(this.props.index)}>{this.props.renderCard(this.props.item)}</Animated.View>;
    }
    return null;
  }
}
