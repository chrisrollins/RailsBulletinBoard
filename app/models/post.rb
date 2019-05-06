class Post < ApplicationRecord
	validates :message, presence: true, length: { minimum: 1, maximum: 1000 }
	belongs_to :user
end
