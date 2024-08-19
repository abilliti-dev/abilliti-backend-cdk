import { RemovalPolicy } from "aws-cdk-lib";
import {
  UserPool,
  AccountRecovery,
  Mfa,
  VerificationEmailStyle,
  UserPoolEmail,
} from "aws-cdk-lib/aws-cognito";
import { Construct } from "constructs";

export class AbillitiCognitoUserPool extends Construct {
  readonly userPool: UserPool;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.userPool = this.createUserPool();
    this.addUserPoolClient("abilliti-react-client");
  }

  private createUserPool(): UserPool {
    return new UserPool(this, "UserPool", {
      userPoolName: "abilliti-users",
      accountRecovery: AccountRecovery.EMAIL_ONLY,
      keepOriginal: {
        email: true,
      },
      removalPolicy: RemovalPolicy.DESTROY,
      deletionProtection: true,
      email: UserPoolEmail.withSES({
        fromEmail: "info@abilliti.com",
        fromName: "abilliti",
      }),
      autoVerify: {
        email: true,
      },
      signInAliases: {
        email: true,
        username: false,
      },
      mfa: Mfa.OPTIONAL,
      mfaMessage: undefined,
      mfaSecondFactor: {
        sms: false,
        otp: true,
      },
      enableSmsRole: false,
      selfSignUpEnabled: true,
      standardAttributes: {
        email: {
          required: true,
          mutable: false,
        },
        givenName: {
          required: true,
          mutable: true,
        },
        familyName: {
          required: true,
          mutable: true,
        },
      },
      userVerification: {
        emailSubject: "abilliti - Verify your email",
        emailBody: "Your verification code is {####}.",
        emailStyle: VerificationEmailStyle.CODE,
      },
    });
  }

  private addUserPoolClient(clientName: string): void {
    this.userPool.addClient("UserPoolClient", {
      userPoolClientName: clientName,
      authFlows: {
        userPassword: true,
        userSrp: true,
      },
    });
  }
}
