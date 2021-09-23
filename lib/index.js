import AuthStack from "./AuthStack";
import ApiStack from "./ApiStack";
import DynamoDbStack from "./DynamoDbStack";
import FileUploadStack from "./FileUploadStack";
import FrontendStack from "./FrontendStack";

export default function main(app) {
  const dbStack = new DynamoDbStack(app, "table");

  const fileUploadStack = new FileUploadStack(app, "bucket");

  const apiStack = new ApiStack(app, "api", {
    table: dbStack.table,
  });

  const authStack = new AuthStack(app, "auth", {
    api: apiStack.api,
    bucket: fileUploadStack.bucket,
  });

  new FrontendStack(app, "frontend", {
    api: apiStack.api,
    auth: authStack.auth,
    bucket: fileUploadStack.bucket,
  });
}
