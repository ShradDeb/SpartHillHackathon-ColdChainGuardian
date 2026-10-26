# AWS deployment status

Requested audience: public website.

Authenticated account access and Bedrock inference work. S3, CloudFront, and IAM read checks succeeded. However Lambda, API Gateway, CloudFormation, and EC2 Availability Zone checks were denied. Lambda, API Gateway, and EC2 errors explicitly name an AWS Organizations service control policy deny.

No website/application cloud deployment was created. No live cloud URL or multi-zone test is claimed. An account/organization administrator must allow the required deployment services, or provide an account where deployment is permitted. Do not bypass the organization policy.

Proposed deployment: CloudFront + private S3 frontend, a regional API Gateway/Lambda application backend with a least-privilege Bedrock execution role, request throttles and cost controls. API Gateway and Lambda provide managed multi-AZ infrastructure. This would still need smoke/load/error tests and observation; a single successful request does not establish zonal failover. A deliberate AZ failover test is not available until deployment and a concrete test design exist.

Local guarded preview remains http://127.0.0.1:4182/.
