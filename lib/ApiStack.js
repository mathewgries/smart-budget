import * as sst from "@serverless-stack/resources";

export default class ApiStack extends sst.Stack {
  api;

  constructor(scope, id, props) {
    super(scope, id, props);

    const { table } = props;

    this.api = new sst.Api(this, "Api", {
      defaultAuthorizationType: "AWS_IAM",
      defaultFunctionProps: {
        environment: {
          TABLE_NAME: table.tableName,
        },
      },
      routes: {
        // Accounts
        "POST /accounts": "src/functions/accounts/create.main",
        "PUT /accounts/{id}": "src/functions/accounts/update.main",
        "GET /accounts/{id}": "src/functions/accounts/get.main",
        "GET /accounts": "src/functions/accounts/list.main",
        "DELETE /accounts/{id}": "src/functions/accounts/delete.main",
        // Users
        "POST /users": "src/functions/users/create.main",
        "PUT /users/{id}": "src/functions/users/update.main",
      },
    });

    this.api.attachPermissions([table]);

    this.addOutputs({
      ApiEndpoint: this.api.url,
    });
  }
}
