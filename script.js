let allEpisodes		= {};
let allShows		= {};
let currentShowId	= 0;

const currentDisplayingElm	= document.getElementById("currentDisplaying");
const showsSelectElm		= document.getElementById("showsSelect");
const episodesSelectElm		= document.getElementById("episodesSelect");
const searchInputElm		= document.getElementById("search-input");
const rootElem				= document.getElementById("root");
const backToShowsBtnElm		= document.getElementById("backToShowsBtn");
const errorMessageElm		= document.getElementById("errorMessage");
const pageLoadingElm		= document.getElementById("pageLoading");

async function setup() {
  allShows = await getShows();
  allShows.sort((a, b) => {
  const nameA = a.name.toUpperCase(); 
  const nameB = b.name.toUpperCase();
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }
  return 0;
});
  for (let show of allShows){
    createShowOption(show);
  }

  makePageForShows(allShows);

  searchInputElm.addEventListener("input", () => {
    const searchWord = searchInputElm.value.toLowerCase();
    // if show chosen, search in episodes, if not search in shows
    if(!allEpisodes || Object.keys(allEpisodes).length === 0){
      searchShows(allShows, searchWord);
    } else {
      searchEpisodes(allEpisodes, searchWord);
    }
  });

  showsSelectElm.addEventListener("change", async () =>{
    currentShowId = showsSelectElm.value;
    pageLoadingElm.textContent = "Loading ...";

     
    if (currentShowId === "all") {
        makePageForShows(allShows);
        backToShowsBtnElm.style.display = "none";
        searchInputElm.disabled=false;
        episodesSelectElm.disabled=true;
        episodesSelectElm.innerHTML = `<option value="all">--Select all--</option>`;
      return false;
    }

    backToShowsBtnElm.style.display = "inline-block";
    episodesSelectElm.disabled=true;
    searchInputElm.disabled=false;
    errorMessageElm.innerHTML = "";

    allEpisodes = await getData(currentShowId);

    makePageForEpisodes(currentShowId);
  });
  
  episodesSelectElm.addEventListener("change", async () => {
    const episodeId = episodesSelectElm.value;

    pageLoadingElm.textContent = "Loading ...";
    
    if (episodeId == "all"){
      makePageForEpisodes(currentShowId); 
    }
    else {
        const selectedEpisode = [];
        for (const episode of allEpisodes){
            if (episode.id == episodeId){
            selectedEpisode.push(episode);
            }
        }
      displayEpisode(selectedEpisode); 
    }
  });
}

function displayEpisode (selectedEpisode) {
    backToShowsBtnElm.style.display = "inline-block";
    rootElem.innerHTML = "";
    pageLoadingElm.innerHTML = "";

  selectedEpisode.forEach(episode => {
    const card = document.createElement("div");
    card.classList.add("card");

    const episodeName = episode.name ?? "Name Unavailable";
    let   episodeMediumImage = "img/placeholder.png";
    const episodeSummary = episode.summary ?? "No Summary Available";
    const episodeCode = `S${String(episode.season).padStart(2, "0")}E${String(episode.season).padStart(2, "0")}`;

    if (episode.image && episode.image.medium)
      episodeMediumImage = episode.image.medium;

    card.innerHTML = `<h3>${episodeName} - ${episodeCode}</h3>
    <img src="${episodeMediumImage}" alt="${episodeName}">
    <p>${episodeSummary}</p>
    `;
    rootElem.appendChild(card);
  });
}

function displayShow (selectedShow) {
    backToShowsBtnElm.style.display = "inline-block";
    rootElem.innerHTML = "";
    pageLoadingElm.innerHTML = "";

  selectedShow.forEach(show => {
    const card = document.createElement("div");
    card.classList.add("card");

    const showName = show.name ?? "Name Unavailable";
    let   showMediumImage = "img/placeholder.png";
    const showSummary = show.summary ?? "No Summary Available";
    const showCode = `S${String(show.season).padStart(2, "0")}E${String(show.season).padStart(2, "0")}`;

    if (show.image && show.image.medium)
      showMediumImage = show.image.medium;

    card.innerHTML = `<h3>${showName} - ${showCode}</h3>
    <img src="${showMediumImage}" alt="${showName}">
    <p>${showSummary}</p>
	<p>Genres: ${show.genres}</p>
    <p>Status: ${show.status}</p>
    <p>Rating: ${show.rating.average}</p>
    <p>Runtime: ${show.runtime}</p>
    `;
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


    card.innerHTML = `<h3>${show.name}</h3>
    <img src="${show.image.medium}" alt="${show.name}">
    <p>${show.summary}</p>
    <p>Genres: ${show.genres}</p>
    <p>Status: ${show.status}</p>
    <p>Rating: ${show.rating.average}</p>
    <p>Runtime: ${show.runtime}</p>
    `;

    // add click listener
    card.addEventListener("click", () => {
      makePageForEpisodes(show.id);
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
  
  for( const episode of episodeList){
    createOption(episode);
  }

  episodeList.forEach(episode => {
    const card = document.createElement("div");
    card.classList.add("card");

    const episodeName = episode.name ?? "Name Unavailable";
    let   episodeMediumImage = "img/placeholder.png";
    const episodeSummary = episode.summary ?? "No Summary Available";
    const episodeCode = `S${String(episode.season).padStart(2, "0")}E${String(episode.season).padStart(2, "0")}`;

    if (episode.image && episode.image.medium)
      episodeMediumImage = episode.image.medium;
    else
      console.log(episodeName);

    card.innerHTML = `<h3>${episodeName} - ${episodeCode}</h3>
    <img src="${episodeMediumImage}" alt="${episodeName}">
    <p>${episodeSummary}</p>
    `;
    rootElem.appendChild(card);

    card.addEventListener("click", () => {
        displayEpisode([episode]);
    });
  });
}

function searchEpisodes(allEpisodes, searchWord){
  const result = [];
  for ( const episode of allEpisodes){
    if (episode.name.toLowerCase().includes(searchWord) || episode.summary.toLowerCase().includes(searchWord)){
      result.push(episode);
    }
  }
  displayEpisode(result);
  
  currentDisplayingElm.textContent = "Displaying " + result.length + "/" + allEpisodes.length + " Episodes";

}

function searchShows(allShows, searchWord){
  const result = [];
  for ( const show of allShows){
    if (show.name.toLowerCase().includes(searchWord) || show.summary.toLowerCase().includes(searchWord)){
      result.push(show);
    }
  }
  displayShow(result);
  
  currentDisplayingElm.textContent = "Displaying " + result.length + "/" + allShows.length + " Shows";

}

function createOption(episode){
  const episodeCode = `S${String(episode.season).padStart(2, "0")}E${String(episode.number).padStart(2, "0")}`;
  const option = document.createElement("option");
  option.textContent = episodeCode + " - "+ episode.name;
  option.value = episode.id;
  episodesSelectElm.appendChild(option);
}

function createShowOption(show){
  const option = document.createElement("option");
  option.textContent = show.name;
  option.value = show.id;
  const select = document.getElementById("showsSelect");
  select.appendChild(option);
}

async function getData(id){
  const url = `https://api.tvmaze.com/shows/${id}/episodes`;
  try {
    const response = await fetch(url);
    if(!response.ok) {
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

async function getShows(){
  const url = "https://api.tvmaze.com/shows";
  try {
    const response = await fetch(url);
    if(!response.ok) {
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

window.onload = setup;