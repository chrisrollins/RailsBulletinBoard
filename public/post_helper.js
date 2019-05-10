const PostHelper = (function()
{
	function determineUserLevelColor(level)
	{
		switch(level)
		{
			case "Silver":
				return "rgba(255, 255, 255, 0.6)";
			break;
			case "Gold":
				return "rgba(255, 255, 160, 1.0)";
			break;
			case "Platinum":
				return "rgba(255, 255, 255, 0.7)";
			break;
			default:
				return "rgba(190, 190, 190, 0.5)";
			break;
		}
	}

	function determineUserLevelLabel(level)
	{
		return "(" + ((!level || level.toLowerCase() === "user") ? "Basic" : level ) + " User)";
	}

	async function buildPost(post)
	{
		const postContainer = document.createElement("div");
		const usernameContainer = document.createElement("div");
		const spanContainer = document.createElement("div");
		const usernameSpan = document.createElement("span");
		const userlevelSpan = document.createElement("span");
		const postedSpan = document.createElement("span");
		const messageContainer = document.createElement("textarea");
		postContainer.className = "post_container";
		usernameContainer.className = "post_username_container";
		messageContainer.className = "post_message_container";
		messageContainer.disabled = "true";
		postedSpan.innerText = " posted:";
		postedSpan.style.fontWeight = "normal";
		spanContainer.appendChild(usernameSpan);
		spanContainer.appendChild(userlevelSpan);
		spanContainer.appendChild(postedSpan);
		spanContainer.style.display = "inline-block";
		spanContainer.style.width = "50%";
		usernameContainer.appendChild(spanContainer);
		usernameContainer.style.backgroundColor = determineUserLevelColor(post.level);
		usernameSpan.innerText = post.username + " ";
		userlevelSpan.innerText = determineUserLevelLabel(post.level);
		userlevelSpan.style.fontSize = "10px";
		messageContainer.value = post.message;

		if((await AppClient.getUser()).username === post.username)
		{
			const buttonContainer = document.createElement("div");
			const editButton = document.createElement("button");
			const cancelEditButton = document.createElement("button");
			const submitEditButton = document.createElement("button");
			const deleteButton = document.createElement("button");
			const editingText = document.createElement("span");
			editingText.innerText = "editing...";
			editingText.style.fontStyle = "italic";
			editingText.style.display = "none";
			buttonContainer.appendChild(editingText);
			buttonContainer.style.display = "inline-block";
			buttonContainer.style.textAlign = "right";
			buttonContainer.style.width = "50%";
			editButton.innerText = "edit";
			cancelEditButton.innerText = "cancel";
			submitEditButton.innerText = "submit";
			deleteButton.innerText = "delete";
			cancelEditButton.style.display = "none";
			submitEditButton.style.display = "none";
			editButton.className = "post_interact_button";
			deleteButton.className = "post_interact_button";
			cancelEditButton.className = "post_interact_button";
			submitEditButton.className = "post_interact_button";

			const startEditMode = () =>
			{
				messageContainer.disabled = false;
				messageContainer.focus();
				editingText.style.display = "inline-block";
				editButton.style.display = "none";
				deleteButton.style.display = "none";
				cancelEditButton.style.display = "inline-block";
				submitEditButton.style.display = "inline-block";
			};

			const endEditMode = () =>
			{
				messageContainer.disabled = true;
				editingText.style.display = "none";
				editButton.style.display = "inline-block";
				deleteButton.style.display = "inline-block";
				cancelEditButton.style.display = "none";
				submitEditButton.style.display = "none";
			};

			editButton.onclick = startEditMode;

			cancelEditButton.onclick = (event) =>
			{
				messageContainer.value = post.message;
				endEditMode();
			};

			submitEditButton.onclick = async (event) =>
			{
				endEditMode();
				if(messageContainer.value === post.message || messageContainer.value === "")
				{									
					messageContainer.value = post.message;
					return;
				}
				AppClient.editPost({id: post.id, message: messageContainer.value});
			};

			deleteButton.onclick = (event) =>
			{
				PageHelper.confirm("Really delete this post?",
				{
					yes: async (event) =>
					{
						await AppClient.deletePost({id: post.id});
						postContainer.parentElement.removeChild(postContainer);
					},
					no: (event) => { }
				});
			};

			buttonContainer.appendChild(editButton);
			buttonContainer.appendChild(cancelEditButton);
			buttonContainer.appendChild(submitEditButton);
			buttonContainer.appendChild(deleteButton);
			usernameContainer.appendChild(buttonContainer);
		}

		postContainer.appendChild(usernameContainer);
		postContainer.appendChild(messageContainer);
		return postContainer;
	}

	return Object.freeze({ buildPost });
})();