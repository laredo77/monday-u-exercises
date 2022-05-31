export class PokemonClient {
  constructor() {
    this.url = "https://pokeapi.co/api/v2/pokemon/";
  }

  async getPokemonData(pokemonId) {
    const tmpUrl = this.url + pokemonId;
    const response = await fetch(tmpUrl);
    if (response.status == 404 || response.statusText == "Not Found") {
      alert(`The ID: ${pokemonId} is invalid.`);
      return;
    }
    const pokemon = await response.json();
    return pokemon;
  }

  async getAllPokemons() {
    const tmpUrl = this.url + "?limit=898";
    const response = await fetch(tmpUrl);
    if (response.status == 404 || response.statusText == "Not Found") {
      alert("Failed to fetch all pokemons.");
      return;
    }
    const pokemons = await response.json();
    return pokemons;
  }
}
