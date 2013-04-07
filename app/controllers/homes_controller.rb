class HomesController < ApplicationController


	def index
    render "show"
	end

  def data
    @info = Home.search_hashtag(params[:hashtag])
    render :json => @info
  end

  def redirect
  	redirect_to :action => "show", :hashtag => params[:hashtagLookup]
  end

  def show
  	@hashtag = params[:hashtag]
  end



end
