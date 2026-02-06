import { localLikesData } from "./storage.js";

async function setup() {
	const body = document.getElementById("body");

	let shows = await getShows();
	let output = {};
	
	for(const show of shows) {
		let episodes = await getEpisodes(show.id);
		const showId = show.id;
		
		output[showId] = episodes.map(function (ep) {
			const randomNumber = Math.floor(Math.random() * 3000) + 1;
			return {[ep.name]:randomNumber}
		});
	}
	console.log(JSON.stringify(output));
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

async function getEpisodes(id) {
	const url = `https://api.tvmaze.com/shows/${id}/episodes`;
	try {
		const response = await fetch(url);
		if (!response.ok) {
			alert("Server problem. Try again.");
			return [];
		}
		const result = await response.json();
		return result;

	} catch (error) {
		return []
	}
}
window.onload = setup;