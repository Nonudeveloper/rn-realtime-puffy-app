import React, { Component } from 'react';
import {Image} from 'react-native';
import Images from "../config/images";

class Rating extends Component{

  constructor(props) {
      super(props);
      this.getSource = this.getSource.bind(this);
      this.state={
        starImage: Images.star_none
      }
  }

  componentDidMount() {
      if(this.props.starValue == 1) {
        this.setState({starImage: Images.star_one});
      } else if(this.props.starValue == 2) {
        this.setState({starImage: Images.star_two});
      } else if(this.props.starValue == 3) {
        this.setState({starImage: Images.star_three});
      } else if(this.props.starValue == 4) {
        this.setState({starImage: Images.star_four});
      } else if(this.props.starValue == 5) {
        this.setState({starImage: Images.star_five});
      } else {
        this.setState({starImage: Images.star_none});
      }
  }

  getSource() {
      if(this.props.starValue == 1) {
        return Images.star_one;
      } else if(this.props.starValue == 2) {
        return Images.star_two;
      } else if(this.props.starValue == 3) {
        return Images.star_three;
      } else if(this.props.starValue == 4) {
        return Images.star_four;
      } else if(this.props.starValue == 5) {
        return Images.star_five;
      } else {
        return Images.star_none;
      }
  }

  render(){
    
    return(
      <Image
        style={styles.starsImg}
        source={this.getSource()}
      />
    )
  }
};

const styles = {
  starsImg: {
    height: 20,
    width: 100,
    resizeMode: "cover",
    marginBottom: 5
  }
}

export default Rating;
