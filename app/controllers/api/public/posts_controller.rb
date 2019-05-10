module Api
	module Public
		class PostsController < ApplicationController
			def index
				posts = Post.limit(10).order(id: :asc).offset(params[:start])
				if posts
					results = []
					posts.each do |post|
						user = User.find(post.user_id)
						results.push({ message: post.message, id: post.id, username: user.username, level: user.level })
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
					render json: { username: user.username, message: post.message, level: user.level }, status: 200
				else
					render json: {}, status: 404
				end
			end

			def update
				status = 401
				if cookies.signed[:user_id] && cookies[:remember_token]					
					user = User.find(cookies.signed[:user_id])
					if user.remember_token_authenticated?(cookies[:remember_token])
						post = Post.find(params[:id])
						if post.user_id == user.id
							json_params = JSON.parse(request.raw_post)
							Post.update(params[:id], message: json_params["message"])
							status = 200
						end
					end
				end
				render json: {}, status: status
			end

			def destroy
				puts params[:id]
				status = 401
				if cookies.signed[:user_id] && cookies[:remember_token]					
					user = User.find(cookies.signed[:user_id])
					if user.remember_token_authenticated?(cookies[:remember_token])
						post = Post.find(params[:id])
						if post.user_id == user.id
							Post.destroy(params[:id])
							status = 200
						end
					end
				end
				render json: {}, status: status
			end
		end
	end
end