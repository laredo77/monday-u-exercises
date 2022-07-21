const PokemonClient = require("../clients/PokemonClient");
const { Item } = require("../db/models");

module.exports = class ItemManager {
  constructor() {
    this.pokemonClient = new PokemonClient();
    this.fetchAllPokemons();
  }

  async addNewItemScheme(item) {
    // input is numbers, try to fetch pokemon and represent the data or
    // case the input is name of pokemon then fetch the data
    let newItem = { name: item, pokemonId: null, status: false };
    if (this.isValidPokemonId(item) || this.allPokemons.includes(item)) {
      try {
        const pokemonData = await this.fetchPokemon(item);
        if (pokemonData) {
          newItem = {
            name: `Catch ${pokemonData.name}`,
            pokemonId: pokemonData.id,
            status: false,
          };
        }
      } catch (error) {
        console.log(`Error while trying to fetch pokemon: ${error.message}`);
      }
    }
    // check if the input already exist, if so, return
    if (await this.checkForDuplicates(newItem.name)) {
      console.log(`Item: {${newItem.name}}, already in the list`);
      return null;
    }
    await this.addItemToDB(newItem);
    return newItem;
  }

  async addItemToDB(item) {
    try {
      await Item.create({
        ItemName: item.name,
        PokemonId: item.pokemonId,
        status: item.status,
      });
    } catch (error) {
      console.log(`Failed writing to the DB: ${error.message}`);
    }
  }

  async checkInputString(itemToAdd) {
    // check if the input separate by commas in purpose
    // to fetch all pokemons (in case input is id's)
    const res = this.checkForCommas(itemToAdd.name);
    const items = [];
    if (Array.isArray(res)) {
      for (const item of res) {
        const retVal = await this.addNewItemScheme(item);
        items.push(retVal);
      }
    } else {
      const retVal = await this.addNewItemScheme(res);
      items.push(retVal);
    }

    const itemsName = [];
    for (const item of items) {
      if (item === null) itemsName.push(item);
      else itemsName.push(item.name);
    }

    if (itemsName[0] === null && itemsName.length == 1) {
      return {
        item: items,
        status: false,
        code: `Item: {${itemToAdd.name}}, already in the list. Cannot add duplicate item`,
      };
    }
    if (itemsName.includes(null)) {
      if (itemsName.every((element) => element === null)) {
        return {
          item: items,
          status: false,
          code: `All items: {${itemToAdd.name}} already in the list. Cannot add duplicate items`,
        };
      } else {
        const nullIndexs = [];
        for (let i = 0; i < itemsName.length; i++) {
          if (itemsName[i] === null) nullIndexs.push(i);
        }
        const nonNullItems = items.filter(function (item) {
          return item != null;
        });
        const listOfItems = itemToAdd.name.split(",");
        const nullItems = [];
        for (const index of nullIndexs) nullItems.push(listOfItems[index]);
        const nonNullItemsName = [];
        for (const item of nonNullItems) nonNullItemsName.push(item.name);
        const nullItemsName = [];
        for (const item of nullItems) nullItemsName.push(item);
        return {
          item: nonNullItems,
          status: true,
          code: `Items: {${nullItemsName}} already in the list. Cannot add duplicate items; Items: {${nonNullItemsName}} added to the list`,
        };
      }
    }
    return {
      item: items,
      status: true,
      code: `Items: {${itemsName}} added to the list`,
    };
  }

  checkForCommas(str) {
    if (str.indexOf(",") > -1) {
      let nanFlag = false; // in case str is not a number
      const tokens = str.split(",");
      for (const token of tokens)
        if (!this.isValidPokemonId(token)) nanFlag = true;
      if (!nanFlag) {
        // in case all the tokens are numbers then
        // check again the string and fetching pokemons
        // if not, just post the string as is
        return tokens;
      }
    }
    return str;
  }

  // check if string is valid pokemon id: positive integer
  isValidPokemonId(str) {
    if (
      !isNaN(str) &&
      parseInt(Number(str)) == str &&
      !isNaN(parseInt(str, 10)) &&
      str > 0 &&
      str < 900
    )
      return true;
    return false;
  }

  // function that check if the input allready exist
  // if so, alert the page the item display in
  async checkForDuplicates(itemToAdd) {
    const item = await Item.findOne({
      where: { ItemName: itemToAdd },
      raw: true,
    });
    if (item) return true;
    return false;
  }

  // fetch pokemon from API, add it to the pokemons map and post its name with "Catch"
  async fetchPokemon(pokemonId) {
    const pokemonData = await this.pokemonClient.getPokemonData(pokemonId);
    if (await pokemonData) return pokemonData;
  }

  async deleteItem(item) {
    try {
      await Item.destroy({ where: { ItemName: item.name } });
      return {
        status: true,
        code: `Item: {${item.name}} successfully removed`,
      };
    } catch (error) {
      console.log(
        `Could not remove the item {${item.name}} from the DB: ${error.message}`
      );
      return {
        status: false,
        code: `Could not remove the item {${item.name}} from the DB: ${error.message}`,
      };
    }
  }

  // fetching all the pokemons and store it in list
  async fetchAllPokemons() {
    const fetchedPokemons = await this.pokemonClient.getAllPokemons();
    if (!fetchedPokemons) fetchedPokemons = [];
    this.allPokemons = [];
    for (const pokemon of Object.values(await fetchedPokemons)[3])
      this.allPokemons.push(pokemon.name);
  }

  // get all items from the db
  async getAll() {
    try {
      const items = await Item.findAll({ raw: true });
      return {
        item: items,
        status: true,
        code: `Items were fetched successfully from the database`,
      };
    } catch (error) {
      console.log(`Error trying to fetch from DB: ${error.message}`);
      return {
        item: null,
        status: false,
        code: `Error trying to fetch from DB: ${error.message}`,
      };
    }
  }

  // delete all items from the db
  async deleteAllItems() {
    try {
      await Item.destroy({ where: {}, truncate: true });
      return {
        status: true,
        code: `All items successfully removed`,
      };
    } catch (error) {
      console.log(`Error trying to remove all items from DB: ${error.message}`);
      return {
        status: false,
        code: `Error trying to remove all items from DB: ${error.message}`,
      };
    }
  }

  async changeStatus(item) {
    try {
      await Item.update(
        { status: item.status },
        { where: { ItemName: item.item } }
      );
      return {
        status: true,
        code: `The status of {${item.item}} successfully changed to ${item.status}`,
      };
    } catch (error) {
      return {
        status: false,
        code: `Could not change the status of {${error.message}}`,
      };
    }
  }
};
