module Api
	module Public
		class UsersController < ApplicationController
			def index
				users = User.limit(10).order(id: :desc).offset(params[:start])
				if users
					render json: { users: users }, status: 200
				end
				render json: {}, status: 500
			end

			def create
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

			def show
				json_params = JSON.parse(request.raw_post)
				user = User.find(json_params["id"])
				if user
					render json: { username: user.username }, status: 200
				else
					render json: {}, status: 404
				end
			end

			#update and destroy are not supported
			def update
				render json: {}, status: 405
			end

			def destroy
				render json: {}, status: 405
			end
		end
	end
end