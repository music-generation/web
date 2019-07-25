module MidiHelper
  require 'securerandom'

  def convert_midi_uri_to_file(uri, file_name)
    midi = Base64.decode64(uri['data:image/png;base64,'.length .. -1])
    file = File.open("public/temp/#{file_name}.mid", 'wb')  { |f| f.write(midi) }
    return file
  end

end
