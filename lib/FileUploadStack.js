import * as sst from "@serverless-stack/resources";

export default class FileUploadStack extends sst.Stack {
  bucket;

  constructor(scope, id, props) {
    super(scope, id, props);

    this.bucket = new sst.Bucket(this, "FileUploads", {
      s3Bucket: {
        cors: [
          {
            maxAge: 3000,
            allowedOrigins: ["*"],
            allowedHeaders: ["*"],
            allowedMethods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
          },
        ],
      },
    });
  }
}
