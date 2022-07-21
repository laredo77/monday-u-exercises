export class ItemClients {
  static async getAllItems() {
    const response = await fetch("http://localhost:8080/items/all", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  }

  static async addNewItem(item) {
    const response = await fetch("http://localhost:8080/items/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: item }),
    });
    return await response.json();
  }

  static async deleteItem(item) {
    const response = await fetch("http://localhost:8080/items/", {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: item }),
    });
    return await response.json();
  }

  static async deleteAllItems() {
    const response = await fetch("http://localhost:8080/items/all", {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  }

  static async changeItemStatus(item) {
    const response = await fetch("http://localhost:8080/items/status", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        item: item.ItemName,
        status: item.status,
      }),
    });
    return await response.json();
  }

  static async fetchPokemon(pokemon) {
    const response = await fetch("http://localhost:8080/items/pokemon", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({pokemon}),
    });
    return await response.json();
  }
}

export default ItemClients;
