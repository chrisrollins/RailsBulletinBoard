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
				user = { username: res.body.username, loggedin: true };
			}
			catch(e)
			{
				user = { username: "", loggedin: false };
			}
		}
		return Object.assign({}, user);
	}

	async function signup({username, password})
	{
		const promise = HTTP.post("api/public/signup", { username, password, password_confirmation: password });
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
		return { username: res.body.username, id: res.body.id };
	}

	async function getPosts({start})
	{
		const promise = HTTP.get(`api/public/posts?start=${start}`);
		pendingRequests.push(promise);
		awaitPending();
		const res = await promise;
		return { posts: res.body.posts };
	}
	
	return Object.freeze(
	{
		getUser, signup, login, logout, newPost, getPost, getPosts
	});
})();