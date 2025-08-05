function createPokemonCardTemplate(p) {
  return `
    <div class="pokemon-card" onclick="showPokemon('${p.name}')">
      <h3>#${p.id} ${p.name}</h3>
      <div class="skeleton" id="skeleton-${p.name}"></div>
      <img src="${p.sprites.front_default}" alt="${p.name}" loading="lazy"
           onload="document.getElementById('skeleton-${p.name}').style.display='none'">
      <div class="types">${createTypeBadges(p.types)}</div>
    </div>`;
}

function createOverlayTemplate(p) {
  return `
    <h2>${p.name.toUpperCase()}</h2>
    <p class="pokemon-id">#${p.id}</p>
    <div class="types">${createTypeBadges(p.types)}</div>
    <img src="${p.sprites.front_default}" alt="${p.name}">
    <p>HP: ${p.stats[0].base_stat}</p>
    <p>Height: ${p.height / 10} m</p>
    <p>Weight: ${p.weight / 10} kg</p>`;
}
