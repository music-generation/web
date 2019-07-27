from base64 import b64decode
import os

def decode_midi(encoded_midi, file_name):
  midi = b64decode(encoded_midi)
  with open(f'temp/{file_name}.mid', 'wb+') as f:
    f.write(midi)
    # generate music file
    os.remove(f'temp/{file_name}.mid')
    f.close()



  # def convert_midi_uri_to_file(uri, file_name)
  #   midi = Base64.decode64(uri['data:image/png;base64,'.length .. -1])
  #   file = File.open("public/temp/#{file_name}.mid", 'wb')  { |f| f.write(midi) }
  #   return file
  # end
