import { RemovalPolicy } from "aws-cdk-lib";
import { AttributeType, BillingMode, Table } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";

export class InvoiceDDB extends Construct {
	readonly table: Table;

	constructor(scope: Construct, id: string) {
		super(scope, id);

		this.table = this.createTable();
	}

	private createTable(): Table {
		return new Table(this, "InvoiceTable", {
			tableName: "invoices",
			partitionKey: {
				name: "userId",
				type: AttributeType.STRING,
			},
			sortKey: {
				name: "invoiceId",
				type: AttributeType.STRING,
			},
			billingMode: BillingMode.PROVISIONED,
			removalPolicy: RemovalPolicy.DESTROY,
			readCapacity: 5,
			writeCapacity: 5,
		});
	}
}
