import { Duration, CfnOutput } from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  HttpApi,
  HttpMethod,
  CorsHttpMethod,
  IHttpRouteAuthorizer,
} from "aws-cdk-lib/aws-apigatewayv2";
import { HttpLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";
import { Function } from "aws-cdk-lib/aws-lambda";
import { UserPool, UserPoolClient } from "aws-cdk-lib/aws-cognito";
import { HttpJwtAuthorizer } from "@aws-cdk/aws-apigatewayv2-authorizers-alpha";

interface ApiGatewayProps {
  lambda: Function;
  userPool: UserPool;
  userPoolClient: UserPoolClient;
}

export class ApiGateway extends Construct {
  readonly api: HttpApi;

  constructor(scope: Construct, id: string, props: ApiGatewayProps) {
    super(scope, id);

    // -----------------------------
    // Create API Gateway
    // -----------------------------
    this.api = new HttpApi(this, "HttpApi", {
      corsPreflight: {
        allowOrigins: ["https://abilliti.com", "https://www.abilliti.com"],
        allowMethods: [
          CorsHttpMethod.GET,
          CorsHttpMethod.POST,
          CorsHttpMethod.PUT,
          CorsHttpMethod.DELETE,
          CorsHttpMethod.OPTIONS,
        ],
        allowHeaders: ["Content-Type", "Authorization"],
        maxAge: Duration.days(10),
        allowCredentials: true,
      },
    });

    // -----------------------------
    // JWT Authorizer for protected routes
    // -----------------------------
    const authorizer = new HttpJwtAuthorizer(
      "CognitoAuthorizer",
      props.userPool.userPoolProviderUrl,
      {
        jwtAudience: [props.userPoolClient.userPoolClientId],
        identitySource: ["$request.header.Authorization"],
        // Ensure access tokens are used
      }
    ) as unknown as IHttpRouteAuthorizer;

    // -----------------------------
    // Public routes (no auth)
    // -----------------------------
    const publicRoutes = [
      "/auth/sign-in",
      "/auth/sign-up",
      "/auth/confirm-sign-up",
      "/auth/reset-password",
      "/auth/confirm-reset-password",
    ];

    publicRoutes.forEach((path) => {
      this.api.addRoutes({
        path,
        methods: [HttpMethod.POST],
        integration: new HttpLambdaIntegration(`${path}-Integration`, props.lambda),
        authorizer: undefined,
      });
    });

    // -----------------------------
    // Protected route (requires access token)
    // -----------------------------
    this.api.addRoutes({
      path: "/auth/profile",
      methods: [HttpMethod.GET],
      integration: new HttpLambdaIntegration("ProfileIntegration", props.lambda),
      authorizer: authorizer,
    });

    // -----------------------------
    // Output the API URL
    // -----------------------------
    new CfnOutput(this, "ApiUrl", {
      value: this.api.url ?? "NO_URL",
      exportName: "ApiUrl",
    });
  }
}
