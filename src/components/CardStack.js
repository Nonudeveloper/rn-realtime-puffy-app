"use strict";
import React, { Component } from "react";
import { View, Dimensions } from "react-native";
import Card from "./Card.js";
const DIMENSIONS = Dimensions.get("window");

export default class CardStack extends Component {
  constructor(props) {
    super(props);
    this.swipeLeft = this.swipeLeft.bind(this);
    this.swipeRight = this.swipeRight.bind(this);
  }

  swipeLeft() {
    if (this.props.cardList.length == 0) {
      return false;
    }

    const card = this.props.cardList[this.props.cardList.length - 1];
    const ref = this[`Card_${card.id}`];
    ref.swipeLeft();
  }

  swipeRight() {
    if (this.props.cardList.length == 0) {
      return false;
    }

    const card = this.props.cardList[this.props.cardList.length - 1];
    const ref = this[`Card_${card.id}`];
    ref.swipeRight();
  }

  render() {
    return this.props.cardList.map((item, i) => {
      return (
        <Card
          ref={ref => {
            this[`Card_${item.id}`] = ref;
          }}
          key={item.id}
          index={i}
          item={item}
          {...this.props}
        />
      );
    });
  }
}
