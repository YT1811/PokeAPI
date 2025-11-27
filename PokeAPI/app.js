const container = document.getElementById("pokemonContainer");
const searchBtn = document.getElementById("searchBtn");
const input = document.getElementById("searchInput");
const cryAudio = document.getElementById("cryAudio");

let currentPokemonId = 1;

// Search with button
searchBtn.addEventListener("click", () => {
  searchPokemon();
});

// Search with ENTER
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchPokemon();
  }
});

function searchPokemon() {
  const query = input.value.toLowerCase();
  if (query) fetchPokemon(query);
}

async function fetchPokemon(nameOrId) {
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${nameOrId}`);
    if (!res.ok) return showError("Pokémon not found!");

    const data = await res.json();
    currentPokemonId = data.id;

    const types = data.types.map(t => t.type.name);
    const moves = data.moves.slice(0, 5).map(m => m.move.name).join(", ");

    const height = (data.height / 10).toFixed(1);
    const weight = (data.weight / 10).toFixed(1);

    const primaryType = types[0];

    container.className = `pokemon-card type-${primaryType}`;

    container.innerHTML = `
      <h2>${data.name.toUpperCase()} (#${data.id})</h2>
      <img src="${data.sprites.front_default}" alt="${data.name}">
      <p><strong>Type:</strong> ${types.join(", ")}</p>
      <p><strong>Height:</strong> ${height} m</p>
      <p><strong>Weight:</strong> ${weight} kg</p>
      <p><strong>Moves:</strong> ${moves}</p>

      <div class="nav-btns">
        <button id="prevBtn">◀ Prev</button>
        <button id="nextBtn">Next ▶</button>
      </div>
    `;

    document.getElementById("prevBtn").onclick = () => {
      if (currentPokemonId > 1) fetchPokemon(currentPokemonId - 1);
    };
    document.getElementById("nextBtn").onclick = () => {
      fetchPokemon(currentPokemonId + 1);
    };

    playCry(currentPokemonId);
  } catch (err) {
    showError("Error loading Pokémon!");
  }
}

function showError(msg) {
  container.className = "pokemon-card";
  container.innerHTML = `<div class="error">❌ ${msg}</div>`;
}

async function playCry(id) {
  const url = `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${id}.ogg`;
  cryAudio.src = url;
  cryAudio.play().catch(() => {});
}

fetchPokemon(currentPokemonId);
