import { StackNavigator } from "react-navigation";
import { TakePhoto, Gallery, Photo, PhotoConfirm, SelectPhoto } from "../scenes";

const NoPhoto = StackNavigator(
  {
    index: {
      screen: TakePhoto,
      path: "/"
    },
    Gallery: {
      screen: Gallery,
      path: "/"
    },
    Photo: {
      screen: Photo,
      path: "/"
    },
    PhotoConfirm: {
      screen: PhotoConfirm,
      path: "/"
    },
    SelectPhoto: {
      screen: SelectPhoto,
      path: "/"
    }
  },
  {
    headerMode: "none"
  }
);

export default NoPhoto;
