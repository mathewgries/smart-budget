import * as sst from "@serverless-stack/resources";

export default class ApiStack extends sst.Stack {
  api;

  constructor(scope, id, props) {
    super(scope, id, props);

    const { table } = props;
    const functionPath = "src/functions";
    const users = `${functionPath}/users`;
    const spending = `${functionPath}/spending`;
    const investing = `${functionPath}/investing`;
		const orders = `${functionPath}/investing/orders`

    this.api = new sst.Api(this, "Api", {
      defaultAuthorizationType: "AWS_IAM",
      defaultFunctionProps: {
        environment: {
          TABLE_NAME: table.tableName,
        },
      },
      cors: true,
      routes: {
        // Spending API
        // Accounts
        "POST /spending/accounts": `${spending}/accounts/create.main`,
        "PUT /spending/accounts/{id}": `${spending}/accounts/update.main`,
        "GET /spending/accounts/{id}": `${spending}/accounts/get.main`,
        "GET /spending/accounts": `${spending}/accounts/list.main`,
        "DELETE /spending/accounts/{id}": `${spending}/accounts/delete.main`,
        // Transactions
        "POST /spending/transactions": `${spending}/transactions/create.main`,
        "PUT /spending/transactions/{id}": `${spending}/transactions/update.main`,
        "GET /spending/transactions/{id}": `${spending}/transactions/get.main`,
        "GET /spending/transactions": `${spending}/transactions/list.main`,
        "DELETE /spending/transactions/{id}": `${spending}/transactions/delete.main`,
        // Categories
        "PUT /spending/categories": `${spending}/categories/update.main`,
        "GET /spending/categories": `${spending}/categories/get.main`,
        "DELETE /spending/categories/{id}": `${spending}/categories/delete.main`,

        // Investing API
				// Accounts
				"POST /investing/accounts": `${investing}/accounts/create.main`,
				"PUT /investing/accounts/{id}": `${investing}/accounts/update.main`,
				"GET /investing/accounts/{id}": `${investing}/accounts/get.main`,
				"GET /investing/accounts": `${investing}/accounts/list.main`,
				"DELETE /investing/accounts/{id}": `${investing}/accounts/delete.main`,
				// Transactions
				"POST /investing/transactions": `${investing}/transactions/create.main`,
        "PUT /investing/transactions/{id}": `${investing}/transactions/update.main`,
        "GET /investing/transactions/{id}": `${investing}/transactions/get.main`,
        "GET /investing/transactions": `${investing}/transactions/list.main`,
        "DELETE /investing/transactions/{id}": `${investing}/transactions/delete.main`,
				// Orders
				// All
				"GET /investing/orders": `${orders}/list.main`,
				// Shares
				"POST /investing/orders/shares": `${orders}/shares/create.main`,
				"GET /investing/orders/shares": `${orders}/shares/list.main`,
				// Options
				"POST /investing/orders/options": `${orders}/options/create.main`,
				"PUT /investing/orders/options/{id}": `${orders}/options/update.main`,
				"GET /investing/orders/options": `${orders}/options/list.main`,
				// Vertical Spreads
				"POST /investing/orders/spreads/vertical": `${orders}/verticalSpreads/create.main`,
				"GET /investing/orders/spreads/vertical": `${orders}/verticalSpreads/list.main`,
				// Signal
				"PUT /investing/signals": `${investing}/signals/update.main`,
				"GET /investing/signals": `${investing}/signals/get.main`,

        // Users
        "POST /users": `${users}/create.main`,
        "PUT /users/{id}": `${users}/update.main`,
        "GET /users/{id}": `${users}/get.main`,
      },
    });

    this.api.attachPermissions([table]);

    this.addOutputs({
      ApiEndpoint: this.api.url,
    });
  }
}
