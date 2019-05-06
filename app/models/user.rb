class User < ApplicationRecord
	validates :username, presence: true, length: { minimum: 3, maximum: 20 }, uniqueness: { case_sensitive: false }
	has_secure_password
	validates :password, presence: true, length: { minimum: 6, maximum: 50 }
	has_many :posts

	def User.digest(string)
	cost = ActiveModel::SecurePassword.min_cost ? BCrypt::Engine::MIN_COST : BCrypt::Engine.cost
	BCrypt::Password.create(string, cost: cost)
	end
	
	attr_accessor :remember_token

	def User.new_token
		SecureRandom.urlsafe_base64
	end

	def remember
		self.remember_token = User.new_token
		update_attribute(:remember_digest, User.digest(remember_token))
	end

	def remember_token_authenticated?(remember_token)
		BCrypt::Password.new(remember_digest).is_password?(remember_token)
	end
end
