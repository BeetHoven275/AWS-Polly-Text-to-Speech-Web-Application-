import json
import boto3
import base64

# إنشاء كائن Polly
polly = boto3.client("polly")

def lambda_handler(event, context):
    try:
        # قراءة الـ body من الطلب
        body = json.loads(event.get("body", "{}"))
        text = body.get("text", "Hello from AWS Polly!")
        voice = body.get("voiceId", "Joanna")
        output_format = body.get("format", "mp3")

        # استدعاء خدمة Polly
        response = polly.synthesize_speech(
            Text=text,
            OutputFormat=output_format,
            VoiceId=voice
        )

        # قراءة الصوت وتحويله Base64
        audio_stream = response["AudioStream"].read()
        audio_base64 = base64.b64encode(audio_stream).decode("utf-8")

        # الرد للـ frontend مع CORS
        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
                "Access-Control-Allow-Headers": "*"
            },
            "body": json.dumps({
                "audio": audio_base64
            })
        }

    except Exception as e:
        # لو حصل أي خطأ، رجع رسالة واضحة مع CORS
        return {
            "statusCode": 500,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
                "Access-Control-Allow-Headers": "*"
            },
            "body": json.dumps({"error": str(e)})
        }
