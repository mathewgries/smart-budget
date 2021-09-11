import ApiStack from "./ApiStack";
import DynamoDbStack from "./DynamoDbStack";
import FileUploadStack from "./FileUploadStack";

export default function main(app){
  const dbStack = new DynamoDbStack(app, "table");
  
  new FileUploadStack(app, "bucket");
  new ApiStack(app, "Api", {
     table: dbStack.table
  })
}