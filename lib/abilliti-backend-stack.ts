import { Stack, StackProps } from "aws-cdk-lib";
import { UserPool } from "aws-cdk-lib/aws-cognito";
import { Construct } from "constructs";
import { AbillitiCognitoUserPool } from "./constructs/cognito-user-pool";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { InvoiceDDB } from "./constructs/invoice-ddb";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { InvoiceS3Bucket } from "./constructs/invoice-s3-bucket";

export class AbillitiBackendStack extends Stack {
  readonly userPool: UserPool;
  readonly invoiceTable: Table;
  readonly invoiceS3Bucket: Bucket;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.userPool = new AbillitiCognitoUserPool(this, "AbillitiCognitoUserPool").userPool;

    this.invoiceTable = new InvoiceDDB(this, "AbillitiInvoiceTable").table;

    this.invoiceS3Bucket = new InvoiceS3Bucket(this, "AbillitiInvoiceS3Bucket").bucket;
  }
}
