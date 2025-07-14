import { Duration, CfnOutput } from "aws-cdk-lib";
import { Construct } from "constructs";
import { HttpApi, CorsHttpMethod, HttpMethod } from "aws-cdk-lib/aws-apigatewayv2";
import { HttpLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";
import { Function } from "aws-cdk-lib/aws-lambda";

interface ApiGatewayProps {
  lambda: Function;
}

export class ApiGateway extends Construct {
  readonly api: HttpApi;

  constructor(scope: Construct, id: string, props: ApiGatewayProps) {
    super(scope, id);

    this.api = new HttpApi(this, "HttpApi", {
      corsPreflight: {
        allowOrigins: ["*"],
        allowMethods: [CorsHttpMethod.GET, CorsHttpMethod.POST, CorsHttpMethod.OPTIONS],
        allowHeaders: ["Content-Type"],
        maxAge: Duration.days(10),
      },
    });

    const routes: { path: string; methods: HttpMethod[] }[] = [
      { path: "/files/{key+}", methods: [HttpMethod.GET] },
    ];

    routes.forEach(({ path, methods }) =>
      this.api.addRoutes({
        path,
        methods,
        integration: new HttpLambdaIntegration(`Int${path}`, props.lambda),
      })
    );

    new CfnOutput(this, "ApiUrl", {
      value: this.api.url ?? "NO_URL",
    });
  }
}
