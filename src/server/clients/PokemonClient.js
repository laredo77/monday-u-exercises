const axios = require("axios");

module.exports = class PokemonClient {
  constructor() {
    this.url = "https://pokeapi.co/api/v2/pokemon/";
  }

  async getPokemonData(pokemonId) {
    try {
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${pokemonId}`
      );
      const pokemon = await response.data;
      return pokemon;
    } catch (err) {
      console.log(err);
    }
  }

  async getAllPokemons() {
    const tmpUrl = this.url + "?limit=898";
    const response = await axios.get(tmpUrl);

    if (response.status == 404 || response.statusText == "Not Found") {
      alert("Failed to fetch all pokemons.");
      return;
    }

    const pokemons = await response.data;
    return pokemons;
  }
};