class HomesController < ApplicationController
  def index
  	@test = 10
  end

  def redirect
  	redirect_to :action => "show", :hashtag => params[:hashtagLookup]
  end

  def show
  	@hashtag = params[:hashtag]
  end
end
