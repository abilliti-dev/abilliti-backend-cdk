import { Stack, StackProps } from "aws-cdk-lib";
import { UserPool } from "aws-cdk-lib/aws-cognito";
import { Construct } from "constructs";
import { AbillitiCognitoUserPool } from "./constructs/cognito-user-pool";

export class AbillitiBackendStack extends Stack {
  readonly userPool: UserPool;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.userPool = new AbillitiCognitoUserPool(
      this,
      "AbillitiCognitoUserPool"
    ).userPool;
  }
}
