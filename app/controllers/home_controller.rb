class HomeController < ApplicationController

  def index
    @temp = system('python3 --version')    
  end

end
