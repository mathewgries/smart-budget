import { ProjectionType } from "@aws-cdk/aws-dynamodb";
import * as sst from "@serverless-stack/resources";

export default class DynamoDbStack extends sst.Stack {
  table;

  constructor(scope, id, props) {
    super(scope, id, props);

    this.table = new sst.Table(this, "SmartBudget", {
      primaryIndex: {
        partitionKey: "PK",
        sortKey: "SK",
      },
      fields: {
        PK: sst.TableFieldType.STRING,
        SK: sst.TableFieldType.STRING,
				id: sst.TableFieldType.STRING,
				type: sst.TableFieldType.STRING,
        GSI1_PK: sst.TableFieldType.STRING,
        createDate: sst.TableFieldType.NUMBER,
        modifyDate: sst.TableFieldType.NUMBER,
        username: sst.TableFieldType.STRING,
        email: sst.TableFieldType.STRING,
        dateOfBirth: sst.TableFieldType.NUMBER,
        accountName: sst.TableFieldType.STRING,
        accountBalance: sst.TableFieldType.STRING,
        transactionAmount: sst.TableFieldType.STRING,
        transactionDate: sst.TableFieldType.NUMBER,
        transactionType: sst.TableFieldType.STRING,
        category: sst.TableFieldType.STRING,
        subCategory: sst.TableFieldType.STRING,
      },
      secondaryIndexes: {
        accountIndex: {
          partitionKey: "GSI1_PK",
          indexProps: {
            projectionType: ProjectionType.INCLUDE,
            nonKeyAttributes: [
              "SK",
							"id",
							"type",
              "accountName",
              "accountBalance",
              "category",
              "subCategory",
              "transactionAmount",
              "transactionDate",
              "transactionType",
            ],
          },
        },
      },
    });
  }
}
