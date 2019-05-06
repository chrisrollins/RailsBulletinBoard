const HTTP = (function()
{
	//method: string
	//route: string
	//body: any type, gets turned into json
	function sendRequest(method, route, body)
	{
		if(typeof route !== "string") { throw new Error("route must be a string."); }
		return new Promise(function(resolve, reject)
		{
			method = method.toUpperCase();
			const xhr = new XMLHttpRequest();
			xhr.open(method, route, true);
			xhr.responseType = "json";
			xhr.onreadystatechange = function()
			{
				if (this.readyState !== XMLHttpRequest.DONE) { return; }
				const resObj = { body: this.response, status: this.status };	
				if (this.status < 400) { resolve(resObj); }
				else { reject(resObj); }				
			};
			const bodyCheck = body !== undefined && body !== null;
			if(bodyCheck && ["GET", "HEAD", "OPTIONS"].indexOf(method) === -1)
			{
				xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
				xhr.send(JSON.stringify(body));
			}
			else
			{
				if(bodyCheck) { console.warn(`${method} does not allow request body, so it was discarded.`); }
				xhr.send();
			}
		});
	}

	const interface = {};
	for(const method of ["GET", "POST", "PUT", "HEAD", "DELETE", "PATCH", "OPTIONS"])
	{
		interface[method.toLowerCase()] = Object.freeze(async function(route, body) { return sendRequest.bind(null, method)(route, body); });
	}
	return Object.freeze(interface);
})();