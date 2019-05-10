const PageHelper = (function()
{
	function confirm(message, { yes, no })
	{
		const popup = document.createElement("div");
		const textContainer = document.createElement("div");
		const buttonContainer = document.createElement("div");
		const confirm = document.createElement("button");
		const cancel = document.createElement("button");
		textContainer.innerText = message;
		textContainer.style.height = "70px";
		confirm.innerText = "Confirm";
		cancel.innerText = "Cancel";
		popup.style.backgroundColor = "rgba(50, 50, 70, 0.7)";
		popup.style.color = "#fff";
		popup.style.textAlign = "center";
		buttonContainer.appendChild(confirm);
		buttonContainer.appendChild(cancel);
		popup.appendChild(textContainer);
		popup.appendChild(buttonContainer);
		popup.style.position = "fixed";
		popup.style.left = "41vw";
		popup.style.top = "15vh";
		popup.style.width = "18vw";
		popup.style.height = "140px";
		popup.style.padding = "10px";
		popup.style.borderRadius = "5px";
		document.body.appendChild(popup);
		confirm.onclick = (e) =>
		{
			document.body.removeChild(popup);
			yes(e)
		};
		cancel.onclick = (e) =>
		{
			document.body.removeChild(popup);
			no(e);
		};
	}

	function refreshContent()
	{
		location.reload();
	}

	return Object.freeze({ confirm, refreshContent });
})();