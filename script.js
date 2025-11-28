//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);

  const searchInput = document.getElementById("search-input");
  searchInput.addEventListener("input", () => {
    const searchWord = searchInput.value.toLowerCase();
    searchEpisodes(allEpisodes, searchWord);
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
  currentDisplaying.textContent = result.length + "/" + allEpisodes.length;
}



window.onload = setup;
