TwitterVis::Application.routes.draw do

  # root :to => 'homes#index'

  # resources :homes, :only => [:index, :show]

  get "/" => "homes#index"

  get "/:hashtag" => "homes#show"

  post "/" => "homes#redirect"
  post "/:hashtag" => "homes#redirect"
  
end