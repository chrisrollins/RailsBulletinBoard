module Api
	module Public
		class LoginController < ApplicationController
			def who_am_i
				response = {}
				status = 401	
				if cookies.signed[:user_id] && cookies[:remember_token]
					user = User.find(cookies.signed[:user_id])
					if user.remember_token_authenticated?(cookies[:remember_token])
						response = { "username" => user.username }
						status = 200
					end
				end
				render json: response, status: status
				
			end

			def signup
				json_params = JSON.parse(request.raw_post)
				user = User.create(username: json_params["username"], password: json_params["password"], password_confirmation: json_params["password_confirmation"])				
				if user.valid?
					user.remember
					cookies.permanent.signed[:user_id] = { value: user.id, expires: 20.years.from_now.utc }
					cookies.permanent[:remember_token] = { value: user.remember_token, expires: 20.years.from_now.utc }
					render json: { username: user.username }, status: 201
				else
					render json: {}, status: 401
				end
			end

			def login
				json_params = JSON.parse(request.raw_post)
				user = User.find_by(username: json_params["username"])
				if user && user.authenticate(json_params["password"])
					user.remember
					cookies.permanent.signed[:user_id] = { value: user.id, expires: 20.years.from_now.utc }
					cookies.permanent[:remember_token] = { value: user.remember_token, expires: 20.years.from_now.utc }
					render json: { username: user.username }, status: 200
				else			
					render json: {}, status: 401
				end
			end

			def logout
				cookies.delete :user_id
				cookies.delete :remember_token
				render json: {}, status: 200
			end
		end
	end
end