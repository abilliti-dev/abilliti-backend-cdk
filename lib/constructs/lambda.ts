import { Duration } from "aws-cdk-lib";
import { Construct } from "constructs";
import { Runtime, Function, Code } from "aws-cdk-lib/aws-lambda";
import { Bucket } from "aws-cdk-lib/aws-s3";
import * as path from "path";

export class ApiRouterLambda extends Construct {
  readonly function: Function;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.function = new Function(this, "Handler", {
      runtime: Runtime.PYTHON_3_12,
      handler: "app.app",
      memorySize: 512,
      timeout: Duration.seconds(10),
      code: Code.fromAsset(path.join(__dirname, "../../../lambda-service/api")),
    });
  }
}
