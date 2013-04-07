TwitterVis::Application.routes.draw do

  # root :to => 'homes#index'

  # resources :homes, :only => [:index, :show]

  get "/" => "homes#index"

  get "/:hashtag" => "homes#show"
  get "/:hashtag/data" => "homes#data"

  post "/" => "homes#redirect"
  post "/:hashtag" => "homes#redirect"


  
end
