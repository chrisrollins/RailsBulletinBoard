const AppClient = (function()
{
	///////////////////////////////////////////
	//private
	let user = undefined;
	let pendingRequests = [];

	async function awaitPending()
	{
		await Promise.all(pendingRequests);
		pendingRequests = [];
	}

	//////////////////////////////////////////
	//public functions to go in the interface
	async function getUser()
	{
		await awaitPending();
		if(!(user || {}).loggedin)
		{
			try
			{				
				const res = await HTTP.post("api/public/who_am_i");
				user = { username: res.body.username, level: res.body.level, loggedin: true };
			}
			catch(e)
			{
				user = { username: "", level: "", loggedin: false };
			}
		}
		return Object.assign({}, user);
	}

	async function signup({username, password, level})
	{
		const promise = HTTP.post(`api/public/signup${(level) ? "_" + level : ""}`, { username, password, password_confirmation: password });
		pendingRequests.push(promise);
		return await getUser();
	}

	async function login({username, password})
	{
		const promise = HTTP.post("api/public/login", { username, password });
		pendingRequests.push(promise);
		return await getUser();
	}

	async function logout()
	{
		const promise = HTTP.post("api/public/logout");
		user = undefined;
		pendingRequests.push(promise);
		awaitPending();
		return await getUser();
	}

	async function newPost({message})
	{
		const promise = HTTP.post("api/public/posts", {message});
		pendingRequests.push(promise);
		awaitPending();
		return await promise;
	}

	async function getPost({id})
	{
		const promise = HTTP.get(`api/public/posts/${id}`);
		pendingRequests.push(promise);
		awaitPending();
		const res = await promise;		
		return { username: res.body.username, level: res.body.level, id: res.body.id };
	}

	async function getPosts({start})
	{
		const promise = HTTP.get(`api/public/posts?start=${start}`);
		pendingRequests.push(promise);
		awaitPending();
		const res = await promise;
		return { posts: res.body.posts };
	}

	async function deletePost({id})
	{
		const promise = HTTP.delete(`api/public/posts/${id}`);
		pendingRequests.push(promise);
		await awaitPending();
	}

	async function editPost({id, message})
	{
		const promise = HTTP.put(`api/public/posts/${id}`, {message});
		pendingRequests.push(promise);
		await awaitPending();
	}
	
	return Object.freeze(
	{
		getUser, signup, login, logout, newPost, getPost, getPosts, deletePost, editPost
	});
})();