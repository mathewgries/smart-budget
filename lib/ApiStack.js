import * as sst from "@serverless-stack/resources";

export default class ApiStack extends sst.Stack {
  api;

  constructor(scope, id, props) {
    super(scope, id, props);

    const { table } = props;
	const functionPath = 'src/functions'
	const accounts = `${functionPath}/accounts`
	const users = `${functionPath}/users`
	const transactions = `${functionPath}/transactions`

    this.api = new sst.Api(this, "Api", {
      defaultAuthorizationType: "AWS_IAM",
      defaultFunctionProps: {
        environment: {
          TABLE_NAME: table.tableName,
        },
      },
      routes: {
        // Accounts
        "POST /accounts": `${accounts}/create.main`,
        "PUT /accounts/{id}": `${accounts}/update.main`,
        "GET /accounts/{id}": `${accounts}/get.main`,
        "GET /accounts": `${accounts}/list.main`,
        "DELETE /accounts/{id}": `${accounts}/delete.main`,
        // Users
        "POST /users": `${users}/create.main`,
        // "PUT /users/{id}": `${users}/update.main`,
        // "GET /users/{id}": `${users}/get.main`,
        // Transactions
        "POST /transactions": `${transactions}/create.main`,
        "PUT /transactions/{id}": `${transactions}/update.main`,
        "GET /transactions/{id}": `${transactions}/get.main`,
        "GET /transactions": `${transactions}/list.main`,
        "DELETE /transactions/{id}": `${transactions}/delete.main`,
      },
    });

    this.api.attachPermissions([table]);

    this.addOutputs({
      ApiEndpoint: this.api.url,
    });
  }
}
