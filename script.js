//You can edit ALL of the code here
async function setup() {
  const allEpisodes = await getData();
  makePageForEpisodes(allEpisodes);

  const searchInput = document.getElementById("search-input");
  searchInput.addEventListener("input", () => {
    const searchWord = searchInput.value.toLowerCase();
    searchEpisodes(allEpisodes, searchWord);
  });

  for( const episode of allEpisodes){
    createOption(episode);
  }
  const select = document.getElementById("searchSelect");
  select.addEventListener("change", () => {
    const episodeId = select.value;
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


  episodeList.forEach(episode => {
    const card = document.createElement("div");
    card.classList.add("card");

    const episodeCode = `S${String(episode.season).padStart(2, "0")}E${String(episode.season).padStart(2, "0")}`;

    card.innerHTML = `<h3>${episode.name} - ${episodeCode}</h3>
    <img src="${episode.image.medium}" alt="${episode.name}">
    <p>${episode.summary}</p>
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
  const select = document.getElementById("searchSelect");
  select.appendChild(option);
}

async function getData() {
  const url = "https://api.tvmaze.com/shows/82/episodes";
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