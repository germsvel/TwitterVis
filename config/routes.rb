TwitterVis::Application.routes.draw do

  root :to => 'homes#index'

  resources :homes, :only => [:index, :show]
  
end
