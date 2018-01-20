import { RNS3 } from "react-native-aws3";
import { NavigationActions } from "react-navigation";

export default async function videoUpload(fileURL, thumb, handleEmit, user_id, profile, feed, event, message_user_id, photoPermission, caption, setGlobal, callback) {
  var dateObj = new Date();
  var now = Math.floor(dateObj.getTime() / 1000);
  var month = dateObj.getUTCMonth() + 1; //months from 1-12
  var day = dateObj.getUTCDate();
  var year = dateObj.getUTCFullYear();

  var path = "uploads/" + year + "/" + month + "/" + day + "/";
  var pathThumb = "resized-uploads/" + year + "/" + month + "/" + day + "/";
  var fileName = user_id + "-" + now + ".mp4";
  var fileNameThumb = user_id + "-" + now + ".jpg";

  const file = {
    uri: fileURL,
    name: fileName,
    type: "video/mp4"
  };

  const file_thumb = {
    uri: thumb,
    name: fileNameThumb,
    type: "image/jpg"
  };

  const options = {
    keyPrefix: path,
    bucket: "puffy-vuploads",
    region: "us-west-1",
    accessKey: "AKIAJ3LTVPA3X7BLP7CA",
    secretKey: "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",
    successActionStatus: 201
  };

  const options_thumb = {
    keyPrefix: pathThumb,
    bucket: "puffy-uploadsresized",
    region: "us-west-1",
    accessKey: "AKIAJ3LTVPA3X7BLP7CA",
    secretKey: "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",
    successActionStatus: 201
  };

  setGlobal("uploadPercent", 0.4);

  RNS3.put(file, options)
    .then(response => {
      if (response.status !== 201) {
        console.log(response);
        return false;
      }

      setGlobal("uploadPercent", 0.6);

      let location = decodeURIComponent(response.body.postResponse.location);

      RNS3.put(file_thumb, options_thumb)
        .then(response => {
          if (response.status !== 201) {
            console.log(response);
            return false;
          }
          let thumb = decodeURIComponent(response.body.postResponse.location);

          let dataString = {
            user_action: "file_upload",
            user_data: {
              name: fileName,
              url: location,
              thumb: thumb,
              type: "video/mp4",
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
        })
        .catch(err => {
          console.log(err);
          setGlobal("upload", false);
        });
    })
    .catch(err => {
      console.log(err);
      setGlobal("upload", false);
    });
}
