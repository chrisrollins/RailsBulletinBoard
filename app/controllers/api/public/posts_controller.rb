module Api
	module Public
		class PostsController < ApplicationController
			def index
				posts = Post.limit(10).order(id: :desc).offset(params[:start])
				if posts
					results = []
					posts.each do |post|
						user = User.find(post.user_id)
						puts post
						results.push({ message: post.message, username: user.username })
					end
					render json: { posts: results }, status: 200
				else
					render json: {}, status: 500
				end
			end

			def create
				response = {}
				status = 401
				if cookies.signed[:user_id] && cookies[:remember_token]
					user = User.find(cookies.signed[:user_id])
					if user.remember_token_authenticated?(cookies[:remember_token])
						json_params = JSON.parse(request.raw_post)
						post = Post.create(user_id: cookies.permanent.signed[:user_id], message: json_params["message"])
						response = { id: post.id }
						status = 201
					end
				end
				render json: response, status: status				
			end

			def show
				json_params = JSON.parse(request.raw_post)
				post = Post.find(json_params["id"])
				user = User.find(post.user_id)
				if post
					render json: { username: user.username, message: post.message }, status: 200
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