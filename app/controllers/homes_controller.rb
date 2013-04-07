class HomesController < ApplicationController


  def index
    params[:hashtag] = "#visualize"

    @info = Home.search_hashtag(params[:hashtag])
    render :json => @info

  end



end
