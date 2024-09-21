import { Stack, StackProps } from "aws-cdk-lib";
import { UserPool } from "aws-cdk-lib/aws-cognito";
import { Construct } from "constructs";
import { AbillitiCognitoUserPool } from "./constructs/cognito-user-pool";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { InvoiceDDB } from "./constructs/invoice-ddb";

export class AbillitiBackendStack extends Stack {
	readonly userPool: UserPool;
	readonly invoiceTable: Table;

	constructor(scope: Construct, id: string, props?: StackProps) {
		super(scope, id, props);

		this.userPool = new AbillitiCognitoUserPool(
			this,
			"AbillitiCognitoUserPool"
		).userPool;

		this.invoiceTable = new InvoiceDDB(this, "AbillitiInvoiceTable").table;
	}
}
