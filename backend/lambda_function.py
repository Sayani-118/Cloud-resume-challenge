import json
import os
import boto3
from botocore.exceptions import ClientError
from decimal import Decimal

# Configure table name via environment variable, with sensible fallback
TABLE_NAME = os.environ.get('TABLE_NAME', 'ResumeVisitors')
REGION = os.environ.get('AWS_REGION', 'us-east-1')

# Initialize DynamoDB resource outside handler for AWS execution environment reuse
dynamodb = boto3.resource('dynamodb', region_name=REGION)
table = dynamodb.Table(TABLE_NAME)

class DecimalEncoder(json.JSONEncoder):
    """Helper to convert DynamoDB Decimal types to standard JSON ints."""
    def default(self, obj):
        if isinstance(obj, Decimal):
            return int(obj)
        return super(DecimalEncoder, self).default(obj)

def lambda_handler(event, context):
    """
    AWS Lambda handler for the Cloud Resume Challenge visitor counter.
    Atomically increments and returns the global visitor count from DynamoDB.
    """
    # CORS headers required for browser Fetch API requests
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
        "Access-Control-Allow-Methods": "GET,OPTIONS",
        "Content-Type": "application/json"
    }

    # Handle HTTP OPTIONS preflight request if routed directly
    http_method = event.get('httpMethod', '') or event.get('requestContext', {}).get('http', {}).get('method', '')
    if http_method == 'OPTIONS':
        return {
            "statusCode": 200,
            "headers": headers,
            "body": json.dumps({"message": "CORS preflight OK"})
        }

    try:
        # Atomic counter update in DynamoDB using 'ADD' expression
        # Key: 'id': 'visitors'
        # Attribute: 'views' incremented by 1
        response = table.update_item(
            Key={'id': 'visitors'},
            UpdateExpression='ADD #v :incr',
            ExpressionAttributeNames={'#v': 'views'},
            ExpressionAttributeValues={':incr': 1},
            ReturnValues='UPDATED_NEW'
        )

        # Extract updated count
        views = int(response['Attributes']['views'])

        return {
            "statusCode": 200,
            "headers": headers,
            "body": json.dumps({"count": views}, cls=DecimalEncoder)
        }

    except ClientError as e:
        error_msg = e.response.get('Error', {}).get('Message', str(e))
        print(f"DynamoDB ClientError: {error_msg}")
        return {
            "statusCode": 500,
            "headers": headers,
            "body": json.dumps({
                "error": "Failed to update visitor count",
                "details": error_msg
            })
        }
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return {
            "statusCode": 500,
            "headers": headers,
            "body": json.dumps({
                "error": "Internal server error",
                "details": str(e)
            })
        }
