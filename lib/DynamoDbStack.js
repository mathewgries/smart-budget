import * as sst from '@serverless-stack/resources';

export default class DynamoDbStack extends sst.Stack {
    table;

    constructor(scope, id, props){
        super(scope,id,props);

        this.table = new sst.Table(this, "SmartBudget", {
            fields: {
                PK: sst.TableFieldType.STRING,
                SK: sst.TableFieldType.STRING,
            },
            primaryIndex: {
                partitionKey: "PK",
                sortKey: "SK"
            },
        });
    }
}