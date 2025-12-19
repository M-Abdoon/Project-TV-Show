let allEpisodes   = {};
let currentShowId = 0;

const currentDisplaying = document.getElementById("currentDisplaying");
const showsSelect       = document.getElementById("showsSelect");
const episodesSelect    = document.getElementById("episodesSelect");
const searchInput       = document.getElementById("search-input");

async function setup() {
  let allShows = await getShows();
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

  //makePageForEpisodes(allEpisodes);

  //let allEpisodes = await getData(allShows[currentShowId].id); // Default | for the first load

  //   createOption(episode);
  // }

  searchInput.addEventListener("input", () => {
    const searchWord = searchInput.value.toLowerCase();
    // if show chosen, search in episodes, if not search in shows
    if(!allEpisodes || Object.keys(allEpisodes).length === 0){
      searchShows(allShows, searchWord);
    } else {
      searchEpisodes(allEpisodes, searchWord);
    }
  });

  showsSelect.addEventListener("change", async () =>{
    currentShowId = showsSelect.value;
    document.getElementById("Loading").textContent = "Loading ...";

     
    if (currentShowId === "all") {
        makePageForShows(allShows);
        document.getElementById("backToShowsBtn").style.display = "none";
        document.getElementById("episodesSelect").disabled=true;
        document.getElementById("search-input").disabled=false;

      return false;
    }

    document.getElementById("backToShowsBtn").style.display = "inline-block";
    document.getElementById("episodesSelect").disabled=false;
    document.getElementById("search-input").disabled=false;
    document.getElementById("errorMessage").innerHTML = "";

    allEpisodes = await getData(currentShowId);

    makePageForEpisodes(currentShowId);
  });
  
  episodesSelect.addEventListener("change", async () => {
    const episodeId = episodesSelect.value;

    document.getElementById("Loading").textContent = "Loading ...";
    
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
    document.getElementById("backToShowsBtn").style.display = "inline-block";
    const rootElem = document.getElementById("root");
    rootElem.innerHTML = "";
    document.getElementById("Loading").innerHTML = "";

    console.log(selectedEpisode);
  selectedEpisode.forEach(episode => {
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
  });
}
function makePageForShows(allShows) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = "";
  document.getElementById("Loading").innerHTML = "";

  allShows.forEach(show => {

    const card = document.createElement("div");
    card.classList.add("card");


    card.innerHTML = `<h3>${show.name}</h3>
    <img src="${show.image.medium}" alt="${show.name}">
    <p>${show.summary}</p>
    <p>genres: ${show.genres}</p>
    <p>status: ${show.status}</p>
    <p>rating: ${show.rating.average}</p>
    <p>rating: ${show.runtime}</p>
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

    currentDisplaying.textContent = "Displaying " + episodeList.length + "/" + episodeList.length + " Episodes"
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = "";
  document.getElementById("Loading").innerHTML = "";
  document.getElementById("backToShowsBtn").style.display = "inline-block";
  document.getElementById("episodesSelect").disabled = false;
  document.getElementById("episodesSelect").innerHTML = `<option value="all">--Select all--</option>`;
  
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
  
  currentDisplaying.textContent = "Displaying " + result.length + "/" + allEpisodes.length + " Episodes";

}

function searchShows(allShows, searchWord){
  const result = [];
  for ( const show of allShows){
    if (show.name.toLowerCase().includes(searchWord) || show.summary.toLowerCase().includes(searchWord)){
      result.push(show);
    }
  }
  displayEpisode(result);
  
  currentDisplaying.textContent = "Displaying " + result.length + "/" + allShows.length + " Shows";

}

function createOption(episode){
  const episodeCode = `S${String(episode.season).padStart(2, "0")}E${String(episode.number).padStart(2, "0")}`;
  const option = document.createElement("option");
  option.textContent = episodeCode + " - "+ episode.name;
  option.value = episode.id;
  const select = document.getElementById("episodesSelect");
  select.appendChild(option);
}

function createShowOption(show){
  const option = document.createElement("option");
  option.textContent = show.name;
  option.value = show.id;
  const select = document.getElementById("showsSelect");
  select.appendChild(option);
}

async function getData(id) {
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