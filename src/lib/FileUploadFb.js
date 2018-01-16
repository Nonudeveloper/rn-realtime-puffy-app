import { RNS3 } from "react-native-aws3";

export default function fileUploadFb(fileURL, fb_id, callback1) {
  var dateObj = new Date();
  var now = Math.floor(dateObj.getTime() / 1000);
  var month = dateObj.getUTCMonth() + 1; //months from 1-12
  var day = dateObj.getUTCDate();
  var year = dateObj.getUTCFullYear();

  var path = "uploads/" + year + "/" + month + "/" + day + "/";
  var fileName = fb_id + "-" + now + ".jpg";

  const file = {
    uri: fileURL,
    name: fileName,
    type: "image/jpg"
  };

  const options = {
    keyPrefix: path,
    bucket: "puffy-uploads",
    region: "us-west-1",
    accessKey: "AKIAJ3LTVPA3X7BLP7CA",
    secretKey: "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",
    successActionStatus: 201
  };

  //find out how to create thumbnail on amazon
  //call an api with response to store this on database
  RNS3.put(file, options).then(response => {
    if (response.status !== 201) {
      console.log(response);
      return false;
    }

    console.log(response);

    let location = decodeURIComponent(response.body.postResponse.location);

    let thumb = location.replace("puffy-uploads", "puffy-uploadsresized");
    let thumb_url = thumb.replace("amazonaws.com/uploads", "amazonaws.com/resized-uploads");

    response["thumb"] = thumb;
    callback1(response);
  });
}
