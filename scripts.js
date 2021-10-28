window.addEventListener("load", function () {
	//Declaring variable
	const video = this.document.querySelector(".viewer");
	let viewerDuration = video.duration;

	let playBtn = this.document.querySelector("[title='Play/Pause (Space)']");
	let volumeBtn = this.document.querySelector("[title='Mute (M)']");
	let progress = this.document.querySelector(".progress"); //Progres je kontejner u kom je smesten progressFilled
	let progressFilled = this.document.querySelector(".progress__filled"); //Koliko jos ima do kraja videa
	let skipButtons = this.document.querySelectorAll("[data-skip]");
	let playerSliders = this.document.querySelectorAll(".player__slider"); //Slideri za pojacavanje zvuka i playBackRate-a
	let fullscreenBtn = this.document.querySelector("[title='Fullscreen']");

	let videoEnd = this.document.querySelector("#video__end");
	let videoCurrentTime = this.document.querySelector("#video__curent");

	this.setInterval(() => (videoCurrentTime.innerHTML = new Date(video.currentTime * 1000).toISOString().substr(14, 5)), 100);
	videoEnd.innerHTML = new Date(viewerDuration * 1000).toISOString().substr(14, 5);
	//Foreach
	skipButtons.forEach((sBtn) => {
		sBtn.addEventListener("click", skipBtn);
	});
	playerSliders.forEach((pSlider, index) => {
		index === 0 ? (video.volume = pSlider.value) : (video.playbackRate = pSlider.value);
		pSlider.addEventListener("input", slider);
	});

	//Listeners and calling functions
	handleProcess();

	playBtn.addEventListener("click", togglePlay);
	video.addEventListener("click", togglePlay);

	//Pauza, mjut, premotvanje, fullscreen, sve na klik odredjenog dugmeta
	window.addEventListener("keydown", (e) => {
		switch (e.key.toLowerCase()) {
			case " ":
				togglePlay();
				break;
			case "m":
				muteVideo(e);
				break;
			case "arrowleft":
				skipBtn(-5);
				break;
			case "arrowright":
				skipBtn(5);
				break;
			case "f":
				openFullScreen();
				break;
		}
		console.log(e.key);
	});

	progress.addEventListener("click", rewindOnClick);

	saveDiv = ""; //Ovo je div koji pokazuje minute i sekunde kad se premotava na hover
	progress.addEventListener("mousemove", showRewindTime);
	progress.addEventListener("mouseleave", function () {
		newDiv.remove();
	});

	video.addEventListener("timeupdate", handleProcess);
	volumeBtn.addEventListener("click", muteVideo);

	fullscreenBtn.addEventListener("click", openFullScreen);
	//Functions
	let isPlayedVideo = false;
	function togglePlay() {
		if (isPlayedVideo === false) {
			playBtn.innerText = "\u25AE\u25AE";
			isPlayedVideo = true;
			this.blur();
			return video.play();
		} else {
			playBtn.innerText = "►";
			isPlayedVideo = false;
			this.blur();
			return video.pause();
		}
	}
	function skipBtn(e) {
		let val;
		typeof e === "number" ? (val = Number(e)) : (val = Number(e.target.dataset.skip));
		return (video.currentTime += val);
	}
	function slider() {
		let name = this.attributes[1].textContent; // Pokazuje da li je slider volume ili playBackRate
		if (name === "volume") {
			video.volume = this.value;
			if (video.volume > 0.0) {
				volumeBtn.innerHTML = "🔊";
				return volumeBtn.classList.remove("mute");
			} else {
				volumeBtn.innerHTML = "🔈";
				return muteVideo();
			}
		} else if (name === "playbackRate") {
			return (video.playbackRate = this.value);
		}
	}
	function muteVideo(e) {
		// console.log(e.target.classList);
		let result = volumeBtn.classList.toggle("mute");
		if (result) {
			volumeBtn.innerText = "🔈";
			playerSliders[0].value = 0;
			this.blur();
			return (video.volume = 0);
		} else {
			volumeBtn.innerText = "🔊";
			playerSliders[0].value = 0.5;
			this.blur();
			return (video.volume = 0.5);
		}
	}
	function handleProcess() {
		let percent = 100 * (video.currentTime / video.duration);
		return (progressFilled.style.flexBasis = `${percent}%`);
	}
	function rewindOnClick(e) {
		let rewindTime = (e.offsetX / this.offsetWidth) * video.duration;
		return (video.currentTime = rewindTime);
	}
	function showRewindTime(e) {
		let durationInSeconds = viewerDuration; // /60
		let currentTimeInVideo;
		//G : I = 100 : P
		let percent = (e.layerX * 100) / this.clientWidth; // Na deo progrss bara koji smo presli misem(e.layerX) izracunava se procenat udaljenosti do kraja progress bara
		durationInSeconds *= percent / 100;
		currentTimeInVideo = new Date(durationInSeconds * 1000).toISOString().substr(14, 5);
		if (percent >= 95) {
			percent = 95;
		}

		createHoverElement(percent, currentTimeInVideo);
	}
	function createHoverElement(percent, currTime) {
		//Procenat gde se nalazi hover element u progress baru(Npr hoverujem ga na 50% pojavice se tekst na sredini)
		newDiv = document.createElement("div");
		newDiv.classList.add("activeHover");
		newDiv.style.left = percent - 3 + "%";
		let content = document.createTextNode(currTime);
		newDiv.appendChild(content);
		progress.parentNode.insertBefore(newDiv, progress);
		newDiv.previousSibling.remove();
	}
	function openFullScreen(isOpen = false) {
		if (video.requestFullscreen) {
			return video.requestFullscreen();
		} else if (video.webkitRequestFullscreen) {
			/* Safari */
			return video.webkitRequestFullscreen();
		} else if (video.msRequestFullscreen) {
			/* IE11 */
			return video.msRequestFullscreen();
		}
	}
});
