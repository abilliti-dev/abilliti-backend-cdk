#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { AbillitiBackendStack } from "../lib/abilliti-backend-stack";

const app = new cdk.App();
new AbillitiBackendStack(app, "AbillitiBackendStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
