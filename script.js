let allEpisodes		= [];
let allShows		= {};
let episodeCache	= {};
let currentShowId	= 0;

const currentDisplayingElm	= document.getElementById("currentDisplaying");
const showsSelectElm		= document.getElementById("showsSelect");
const episodesSelectElm		= document.getElementById("episodesSelect");
const searchInputElm		= document.getElementById("search-input");
const rootElem				= document.getElementById("root");
const backToShowsBtnElm		= document.getElementById("backToShowsBtn");
const pageLoadingElm		= document.getElementById("pageLoading");

async function setup() {
	allShows = await getShows();
	allShows.sort((a, b) => {
		const nameA = a.name.toUpperCase();
		const nameB = b.name.toUpperCase();
		if (nameA < nameB) return -1;
		if (nameA > nameB) return 1;
		return 0;
	});
	for (let show of allShows) {
		createShowOption(show);
	}

	makePageForShows(allShows);

	searchInputElm.addEventListener("input", () => {
		const searchWord = searchInputElm.value.toLowerCase();
		if (allEpisodes.length === 0) {
			searchShows(allShows, searchWord);
		} else {
			searchEpisodes(allEpisodes, searchWord);
		}
	});

	showsSelectElm.addEventListener("change", async () => {
		pageLoadingElm.textContent = "Loading ...";

		if (showsSelectElm.value === "all") {
			makePageForShows(allShows);
			backToShowsBtnElm.style.display = "none";
			searchInputElm.disabled = false;
			episodesSelectElm.disabled = true;
			episodesSelectElm.innerHTML = `<option value="all">--Select all--</option>`;
			return false;
		}

		backToShowsBtnElm.style.display = "inline-block";
		episodesSelectElm.disabled = true;
		searchInputElm.disabled = false;

		currentShowId = showsSelectElm.value;
		allEpisodes = await getData(currentShowId);

		makePageForEpisodes(currentShowId);
	});

	episodesSelectElm.addEventListener("change", async () => {
		const episodeId = episodesSelectElm.value;

		pageLoadingElm.textContent = "Loading ...";

		if (episodeId == "all") {
			makePageForEpisodes(currentShowId);
		} else {
			const selectedEpisode = [];
			for (const episode of allEpisodes) {
				if (episode.id == episodeId) {
					selectedEpisode.push(episode);
				}
			}
			currentDisplayingElm.textContent = "Displaying 1	/" + allEpisodes.length + " Episodes";
			displayEpisode(selectedEpisode);
		}
	});

	backToShowsBtnElm.addEventListener("click", () => {
		backToShowsBtnElm.style.display = "none";

		showsSelectElm.value = "all";

		episodesSelectElm.disabled = true;
		episodesSelectElm.innerHTML = `<option value="all">--Select all--</option>`;

		searchInputElm.value = "";
		searchInputElm.disabled = false;

		allEpisodes = [];
		makePageForShows(allShows);
	});
}

function displayEpisode(selectedEpisode) {
	backToShowsBtnElm.style.display = "inline-block";
	rootElem.innerHTML = "";
	pageLoadingElm.innerHTML = "";

	selectedEpisode.forEach(episode => {
		const card = document.createElement("div");
		card.classList.add("card");

		const ep = normalizeEpisode(episode);

		card.innerHTML = `
			<h3>${escapeHTML(ep.name)} - ${ep.code}</h3>
			<img src="${ep.image}" alt="${escapeHTML(ep.name)}">
			<p>${stripHTML(ep.summary)}</p>
		`;

		rootElem.appendChild(card);
	});
}

function displayShow(selectedShow) {
	backToShowsBtnElm.style.display = "inline-block";
	rootElem.innerHTML = "";
	pageLoadingElm.innerHTML = "";

	selectedShow.forEach(show => {
		const card = document.createElement("div");
		card.classList.add("card");

		const showName = show.name ?? "Name Unavailable";
		let showMediumImage = "img/placeholder.png";
		const showSummary = show.summary ?? "No Summary Available";

		if (show.image && show.image.medium)
			showMediumImage = show.image.medium;

		card.innerHTML = `
		<h3>${escapeHTML(showName)}</h3>
		<img src="${showMediumImage}" alt="${escapeHTML(showName)}">
		<p>${stripHTML(showSummary)}</p>
		<p>Genres: ${escapeHTML(show.genres.join(", "))}</p>
		<p>Status: ${escapeHTML(show.status)}</p>
		<p>Rating: ${escapeHTML(String(show.rating.average))}</p>
		<p>Runtime: ${escapeHTML(String(show.runtime))}</p>
	`;

		card.addEventListener("click", async () => {
			currentShowId = show.id;
			showsSelectElm.value = currentShowId;
			allEpisodes = await getData(currentShowId);
			makePageForEpisodes(currentShowId);
		});
		rootElem.appendChild(card);
	});
}

function makePageForShows(allShows) {
	rootElem.innerHTML = "";
	pageLoadingElm.innerHTML = "";
	currentDisplayingElm.textContent = "Displaying " + allShows.length + "/" + allShows.length + " Shows"

	allShows.forEach(show => {

		const card = document.createElement("div");
		card.classList.add("card");

		card.innerHTML = `
		<h3>${escapeHTML(show.name)}</h3>
		<img src="${show.image.medium}" alt="${escapeHTML(show.name)}">
		<p>${stripHTML(show.summary)}</p>
		<p>Genres: ${escapeHTML(show.genres.join(", "))}</p>
		<p>Status: ${escapeHTML(show.status)}</p>
		<p>Rating: ${escapeHTML(String(show.rating.average))}</p>
		<p>Runtime: ${escapeHTML(String(show.runtime))}</p>
	`;

		card.addEventListener("click", async () => {
			currentShowId = show.id;
			showsSelectElm.value = currentShowId;
			allEpisodes = await getData(currentShowId);
			makePageForEpisodes(currentShowId);
		});

		rootElem.appendChild(card);
	});
}

async function makePageForEpisodes(showId) {
	let episodeList = await getData(showId);

	currentDisplayingElm.textContent = "Displaying " + episodeList.length + "/" + episodeList.length + " Episodes"
	rootElem.innerHTML = "";
	pageLoadingElm.innerHTML = "";
	backToShowsBtnElm.style.display = "inline-block";
	episodesSelectElm.disabled = false;
	episodesSelectElm.innerHTML = `<option value="all">--Select all--</option>`;

	for (const episode of episodeList) {
		createOption(episode);
	}

	episodeList.forEach(episode => {
		const card = document.createElement("div");
		card.classList.add("card");

		const ep = normalizeEpisode(episode);

		card.innerHTML = `
			<h3>${escapeHTML(ep.name)} - ${ep.code}</h3>
			<img src="${ep.image}" alt="${escapeHTML(ep.name)}">
			<p>${stripHTML(ep.summary)}</p>
		`;
		rootElem.appendChild(card);

		card.addEventListener("click", () => {
			episodesSelectElm.value = episode.id;
			currentDisplayingElm.textContent = "Displaying 1	/" + episodeList.length + " Episodes"
			displayEpisode([episode]);
		});
	});
}

function searchEpisodes(allEpisodes, searchWord) {
	const result = [];
	for (const episode of allEpisodes) {
		const episodeName = (episode.name ?? "").toLowerCase();
		const episodeSummary = (episode.summary ?? "").toLowerCase();
		if (episodeName.includes(searchWord) || episodeSummary.includes(searchWord)) {
			result.push(episode);
		}
	}
	displayEpisode(result);

	currentDisplayingElm.textContent = "Displaying " + result.length + "/" + allEpisodes.length + " Episodes";
}

function searchShows(allShows, searchWord) {
	const result = [];
	for (const show of allShows) {
		if (show.name.toLowerCase().includes(searchWord) ||
			show.summary.toLowerCase().includes(searchWord) ||
			show.genres.join(" ").toLowerCase().includes(searchWord)) {
			result.push(show);
		}
	}
	displayShow(result);

	currentDisplayingElm.textContent = "Displaying " + result.length + "/" + allShows.length + " Shows";
}

function createOption(episode) {
	const episodeCode = `S${String(episode.season).padStart(2, "0")}E${String(episode.number).padStart(2, "0")}`;
	const option = document.createElement("option");
	option.textContent = episodeCode + " - " + episode.name;
	option.value = episode.id;
	episodesSelectElm.appendChild(option);
}

function createShowOption(show) {
	const option = document.createElement("option");
	option.textContent = show.name;
	option.value = show.id;
	const select = document.getElementById("showsSelect");
	select.appendChild(option);
}

async function getData(id) {
	if (episodeCache[id]) {
		return episodeCache[id];
	}
	const url = `https://api.tvmaze.com/shows/${id}/episodes`;
	try {
		const response = await fetch(url);
		if (!response.ok) {
			alert("Server problem. Try again.");
			return [];
		}
		const result = await response.json();
		episodeCache[id] = result;
		return result;

	} catch (error) {
		alert("Connection error. Try again.");
		return []
	}
}

async function getShows() {
	const url = "https://api.tvmaze.com/shows";
	try {
		const response = await fetch(url);
		if (!response.ok) {
			alert("Server problem. Try again.");
			return [];
		}
		const result = await response.json();
		return result;

	} catch (error) {
		alert("Connection error. Try again.");
		return []
	}
}

function normalizeEpisode(episode) {
	return {
		name: episode.name ?? "Name Unavailable",
		image: episode.image?.medium ?? "img/placeholder.png",
		summary: episode.summary ?? "No Summary Available",
		code: `S${String(episode.season).padStart(2, "0")}E${String(episode.number).padStart(2, "0")}`
	};
}

function escapeHTML(str) {
	return String(str)
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}

function stripHTML(str) {
	const temp = document.createElement("div");
	temp.innerHTML = str;
	return temp.textContent || temp.innerText || "";
}

window.onload = setup;

card.innerHTML = `
  <h3>${ep.name} - ${ep.code}</h3>
  <img src="${ep.image}" alt="${ep.name}">
  <p>${ep.summary}</p>
`;