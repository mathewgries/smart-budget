import AuthStack from "./AuthStack";
import ApiStack from "./ApiStack";
import DynamoDbStack from "./DynamoDbStack";
import FileUploadStack from "./FileUploadStack";

export default function main(app) {
  const dbStack = new DynamoDbStack(app, "table");

  const fileUploadStack = new FileUploadStack(app, "bucket");

  const apiStack = new ApiStack(app, "api", {
    table: dbStack.table,
  });

  new AuthStack(app, "auth", {
    api: apiStack.api,
    bucket: fileUploadStack.bucket,
  });
}
