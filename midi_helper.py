from base64 import b64decode
import os
from time import sleep
import boto3
from botocore.exceptions import ClientError

def decode_midi(encoded_midi, file_name):
  midi = b64decode(encoded_midi)
  with open(f'midis/{file_name}.mid', 'wb+') as f:
    f.write(midi)
    # generate music file
    # os.remove(f'midis/{file_name}.mid')
    f.close()

def generate_melody(file_name):
  # generate melody
  sleep(15)


# def upload_file(file_name, bucket, object_name = None):
#   s3_client = boto3.client('s3')

#   try:
#     response = s3_client.upload_file(file_name, bucket, object_name)
#   except ClientError as e:
#     return False

#   return True