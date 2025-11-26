//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = "";

  episodeList.forEach(episode => {
    const card = document.createElement("div");
    card.textContent = `Name: ${episode.name}`;



    rootElem.appendChild(card);
  });
}

window.onload = setup;
