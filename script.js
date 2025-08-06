let pokedex = {};
let offset = 0;
let limit = 150
let step = 40
let isFirstLoad = true;
let isLoading = false;
let currentPokemonIndex = 0;
let pokemonKeys = [];
let filteredPokemonKeys = [];
let isDataLoaded = false;

function init() {
  loadMorePokemon().then(() => ensureScrollable());
}

async function loadMorePokemon() {
  if (isLoading) return;
  isLoading = true;
  showLoader();

  let res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
  let data = await res.json();

  for (let i = 0; i < data.results.length; i++) {
    await fetchPokemon(data.results[i].name);
  }

  offset += limit;

  if (isFirstLoad) {
    limit = step;
    isFirstLoad = false;
  }

  renderPokedex();
  hideLoader();
  isLoading = false;
}

async function init() {
  await loadMorePokemon();
  isDataLoaded = true;
  ensureScrollable();
  filterByType();
}

function ensureScrollable() {
  if (document.documentElement.scrollHeight <= window.innerHeight) loadMorePokemon();
}

async function fetchPokemon(name) {
  let res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
  pokedex[name] = await res.json();
}

function renderPokedex() {
  let container = document.getElementById("pokemon-container");
  container.innerHTML = '';
  for (let key in pokedex) container.innerHTML += createPokemonCardTemplate(pokedex[key]);
}

function showPokemon(name) {
  pokemonKeys = Object.keys(pokedex);
  filterByType();
  let list = filteredPokemonKeys.length > 0 ? filteredPokemonKeys : pokemonKeys;
  currentPokemonIndex = list.indexOf(name);
  renderOverlay(pokedex[name]);
}

function renderOverlay(p) {
  document.getElementById("pokemon-details").innerHTML = createOverlayTemplate(p);
  document.getElementById("pokemon-overlay").style.display = "flex";
}

function showPrevPokemon(e) {
  e.stopPropagation();
  let list = filteredPokemonKeys.length > 0 ? filteredPokemonKeys : pokemonKeys;
  currentPokemonIndex = (currentPokemonIndex - 1 + list.length) % list.length;
  renderOverlay(pokedex[list[currentPokemonIndex]]);
}

function showNextPokemon(e) {
  e.stopPropagation();
  let list = filteredPokemonKeys.length > 0 ? filteredPokemonKeys : pokemonKeys;
  currentPokemonIndex = (currentPokemonIndex + 1) % list.length;
  renderOverlay(pokedex[list[currentPokemonIndex]]);
}

function closeOverlay() {
  document.getElementById("pokemon-overlay").style.display = "none";
}

function filterPokemon() {
  let search = document.getElementById("search").value.trim().toLowerCase();

  if (search.length > 0 && search.length < 3) return;

  filterByType();
}

async function filterByType() {
  if (!isDataLoaded) {
    await loadMorePokemon();
    isDataLoaded = true;
  }

  let selectedType = document.getElementById("type-filter").value;
  let search = document.getElementById("search").value.toLowerCase();
  let container = document.getElementById("pokemon-container");
  container.innerHTML = '';

  filteredPokemonKeys = [];

  for (let key in pokedex) {
    let p = pokedex[key];
    let types = p.types.map(t => t.type.name);

    if ((selectedType === "" || types.includes(selectedType)) && key.includes(search)) {
      filteredPokemonKeys.push(key);
      container.innerHTML += createPokemonCardTemplate(p);
    }
  }
}

function showLoader() {
  document.getElementById("loader").style.display = "block";
}

function hideLoader() {
  document.getElementById("loader").style.display = "none";
}

window.onscroll = function () {
  let top = document.documentElement.scrollTop || document.body.scrollTop;
  let height = document.documentElement.scrollHeight || document.body.scrollHeight;
  let client = document.documentElement.clientHeight;

  document.getElementById("scrollTopBtn").style.display = (top > 200) ? "block" : "none";
  if (top + client >= height - 50) loadMorePokemon();
};

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.addEventListener("keydown", function (e) {
  if (document.getElementById("pokemon-overlay").style.display === "flex") {
    if (e.key === "ArrowLeft") showPrevPokemon(e);
    if (e.key === "ArrowRight") showNextPokemon(e);
    if (e.key === "Escape") closeOverlay();
  }
});