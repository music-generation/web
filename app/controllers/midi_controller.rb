class MidiController < ApplicationController
  include MidiHelper
  require 'securerandom'

  skip_before_action :verify_authenticity_token

  def handle
    file_name = SecureRandom.hex
    uri = midi_params[:uri]
    file = convert_midi_uri_to_file(uri, file_name)
    # send file to ml service
    # receive generated url for midi
    File.delete("public/temp/#{file_name}.mid")

    redirect_to root_path
  end

  private 

    def midi_params
      params.permit(:uri)
    end

end
