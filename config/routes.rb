Rails.application.routes.draw do
	namespace :api do
		namespace :public do
			post 'who_am_i', to: 'login#who_am_i'
			post 'signup', to: 'login#signup'
			post 'login', to: 'login#login'
			post 'logout', to: 'login#logout'
			get 'users', to: 'users#index'
			get 'user', to: 'users#show'
			resources :posts
		end
	end
	get 'api/*path', to: 'general#not_found_json'
	post 'api/*path', to: 'general#not_found_json'
	put 'api/*path', to: 'general#not_found_json'
	patch 'api/*path', to: 'general#not_found_json'
	delete 'api/*path', to: 'general#not_found_json'
	get '*path', to: 'general#not_found_page'
end

 # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html