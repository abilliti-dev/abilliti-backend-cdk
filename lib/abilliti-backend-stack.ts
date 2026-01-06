import { Stack, StackProps } from "aws-cdk-lib";
import { UserPool } from "aws-cdk-lib/aws-cognito";
import { Construct } from "constructs";
import { AbillitiCognitoUserPool } from "./constructs/cognito-user-pool";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { InvoiceDDB } from "./constructs/invoice-ddb";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { InvoiceS3Bucket } from "./constructs/invoice-s3-bucket";
import { Function } from "aws-cdk-lib/aws-lambda";
import { ApiRouterLambda } from "./constructs/lambda";
import { ApiGateway } from "./constructs/api-gateway";
import { HttpApi } from "aws-cdk-lib/aws-apigatewayv2";
import { UserPoolClient } from "aws-cdk-lib/aws-cognito";

export class AbillitiBackendStack extends Stack {
  readonly userPool: UserPool;
  readonly userPoolClient: UserPoolClient;
  readonly invoiceTable: Table;
  readonly invoiceS3Bucket: Bucket;
  readonly lambdaFunction: Function;
  readonly apiGateway: HttpApi;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.userPool = new AbillitiCognitoUserPool(this, "AbillitiCognitoUserPool").userPool;

    this.userPoolClient = new UserPoolClient(this, "AbillitiUserPoolClient", {
      userPool: this.userPool,
      generateSecret: false,
    });

    this.invoiceTable = new InvoiceDDB(this, "AbillitiInvoiceTable").table;

    this.invoiceS3Bucket = new InvoiceS3Bucket(this, "AbillitiInvoiceS3Bucket").bucket;

    this.lambdaFunction = new ApiRouterLambda(this, "AbillitiLambda").function;

    this.apiGateway = new ApiGateway(this, "AbillitiApiGateway", {
      lambda: this.lambdaFunction,
      userPool: this.userPool,
      userPoolClient: this.userPoolClient,
    }).api;
  }
}
