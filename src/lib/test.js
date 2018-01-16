import { RNS3 } from "react-native-aws3";
import { NavigationActions } from "react-navigation";
import { transferUtility } from "react-native-s3";

export default async function videoUpload(fileURL, thumb, handleEmit, user_id, profile, feed, event, message_user_id, photoPermission, caption, setGlobal, callback) {
  var dateObj = new Date();
  var now = Math.floor(dateObj.getTime() / 1000);
  var month = dateObj.getUTCMonth() + 1; //months from 1-12
  var day = dateObj.getUTCDate();
  var year = dateObj.getUTCFullYear();

  var path = "uploads/" + year + "/" + month + "/" + day + "/";
  var pathThumb = "resized-uploads/" + year + "/" + month + "/" + day + "/";
  var fileName = user_id + "-" + now + ".mp4";
  var pathName = path + fileName;
  var pathNameThumb = pathThumb + fileName;

  const file = {
    uri: fileURL,
    name: fileName,
    type: "video/mp4"
  };

  const file_thumb = {
    uri: thumb,
    name: fileName,
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

  const task1 = await transferUtility.upload({
    bucket: "puffy-vuploads",
    key: pathName,
    file: fileURL,
    meta: {
      "x-amz-acl": "public-read",
      "Content-Type": "video/mp4"
    }
  });

  const task2 = await transferUtility.upload({
    bucket: "puffy-uploadsresized",
    key: pathNameThumb,
    file: thumb,
    meta: {
      "x-amz-acl": "public-read",
      "Content-Type": "image/jpg"
    }
  });

  let task_id1 = task1.id;
  let task_id2 = task2.id;
  let file_url = "https://puffy-vuploads.s3.amazonaws.com/" + pathName;
  let file_url_thumb = "https://puffy-uploadsresized.s3.amazonaws.com/" + pathNameThumb;

  transferUtility.subscribe(task_id1, (err, task) => {
    if (err) {
      console.log(error);
      setGlobal("upload", false);
      return false;
    }
    if (task.state == "completed") {
      transferUtility.unsubscribe(task_id1);

      let dataString = {
        user_action: "file_upload",
        user_data: {
          name: fileName,
          url: file_url,
          thumb: file_url_thumb,
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
      setGlobal("upload", false);
    } else {
      let percent = task.bytes / task.totalBytes;
      setGlobal("uploadPercent", percent);
    }
    console.log(task);
  });
}
