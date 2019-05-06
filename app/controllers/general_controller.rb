class GeneralController < ApplicationController
	def not_found_json
		render json: {}, status: 404
	end

	def not_found_page
		redirect_to '/not_found'
	end
end