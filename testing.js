let showContainer = {};

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

  let allEpisodes = await getData(allShows[0].id); // Default | for the first load
  makePageForEpisodes(allEpisodes);
  const showsSelect = document.getElementById("showsSelect");
  const episodesSelect      = document.getElementById("episodesSelect");
  const searchInput = document.getElementById("search-input");

  searchInput.addEventListener("input", () => {
    const searchWord = searchInput.value.toLowerCase();
    searchEpisodes(allEpisodes, searchWord);
  });

  for( const episode of allEpisodes){
    createOption(episode);
  }

  showsSelect.addEventListener("change", async () =>{
    const valueId = showsSelect.value;
    document.getElementById("Loading").textContent = "Loading ...";
    if (valueId === "all") {
      makePageForEpisodes([]); // clear page

      document.getElementById("episodesSelect").disabled=true;
      document.getElementById("search-input").disabled=true;
      document.getElementById("errorMessage").innerHTML =
       `<div id="errorMessage">Please select a Show to display episodes</div>`;

      return false;
    }

    document.getElementById("episodesSelect").disabled=false;
    document.getElementById("search-input").disabled=false;
    document.getElementById("errorMessage").innerHTML = "";

    if (Object.hasOwn(showContainer, valueId)){
    allEpisodes = showContainer[valueId];
    }
    else{
      allEpisodes = await getData(valueId);

      document.getElementById("episodesSelect").innerHTML 
      = `<option value="all">--Select all--</option>`;
      for( const episode of allEpisodes){
        createOption(episode);
      }
    }
    makePageForEpisodes(allEpisodes);
  })
  

  episodesSelect.addEventListener("change", async () => {
    const episodeId = episodesSelect.value;

    document.getElementById("Loading").textContent = "Loading ...";
    
    if (episodeId == "all"){
      makePageForEpisodes(allEpisodes); 
    }
    else {
      const selectedEpisode = [];
      for (const episode of allEpisodes){
        if (episode.id == episodeId){
          selectedEpisode.push(episode);
        }
      }
      makePageForEpisodes(selectedEpisode); 
    }
  });
  
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = "";
  document.getElementById("Loading").innerHTML = "";

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
  });
}

function searchEpisodes(allEpisodes, searchWord){
  const result = [];
  for ( const episode of allEpisodes){
    if (episode.name.toLowerCase().includes(searchWord) || episode.summary.toLowerCase().includes(searchWord)){
      result.push(episode);
    }
  }
  makePageForEpisodes(result);
  
  const currentDisplaying = document.getElementById("currentDisplaying");
  currentDisplaying.textContent = "Displaying " + result.length + "/" + allEpisodes.length + " Episodes";

  if (searchWord.length == 0) {
    currentDisplaying.innerHTML = "";
  }
}

function createOption(episode){
  const episodeCode = `S${String(episode.season).padStart(2, "0")}E${String(episode.number).padStart(2, "0")}`;
  const option = document.createElement("option")
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