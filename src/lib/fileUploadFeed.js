import { RNS3 } from "react-native-aws3";
import { NavigationActions } from "react-navigation";

export default async function fileUploadFeed(fileURL, handleEmit, user_id, profile, feed, event, message_user_id, photoPermission, caption, setGlobal, callback) {
  var dateObj = new Date();
  var now = Math.floor(dateObj.getTime() / 1000);
  var month = dateObj.getUTCMonth() + 1; //months from 1-12
  var day = dateObj.getUTCDate();
  var year = dateObj.getUTCFullYear();

  var path = "uploads/uploads/" + year + "/" + month + "/" + day + "/";
  var fileName = user_id + "-" + now + ".jpg";

  const file = {
    uri: fileURL.uri,
    name: fileName,
    type: "image/jpg"
  };

  const options = {
    keyPrefix: path,
    bucket: "puffy.assets",
    region: "us-west-2",
    accessKey: "AKIAJ4QG3VEWSQN46YIQ",
    secretKey: "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",
    successActionStatus: 201
  };

  setGlobal("uploadPercent", 0.6);

  RNS3.put(file, options)
    .then(response => {
      if (response.status !== 201) {
        //console.log(response);
        callback(0);
        return false;
      }

      //console.log(response);

      let location = decodeURIComponent(response.body.postResponse.location);

      let thumb = location.replace("puffy.aseets/uploads", "puffy.aseets/uploadsresized");
      let thumb_url = thumb.replace("amazonaws.com/uploads/uploads", "amazonaws.com/uploadsresized/resized-uploads");

      let dataString = {
        user_action: "file_upload",
        user_data: {
          name: fileName,
          url: location,
          thumb: thumb_url,
          type: "image/jpg",
          user_id: user_id,
          profile: profile,
          feed: feed,
          event: event,
          message_user_id: message_user_id,
          photoPermission: photoPermission,
          caption: caption
        }
      };
      handleEmit(dataString);
      setGlobal("uploadPercent", 0.8);
      callback(1);
    })
    .catch(err => {
      //console.log(err);
      setGlobal("upload", false);
      callback(0);
    });
}
