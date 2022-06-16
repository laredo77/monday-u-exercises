const utilUI = require('./utilUI');

module.exports = class ItemClients {
  constructor(itemManager) {
    this.itemManager = itemManager
    this.utilUI = new utilUI(this.itemManager);
  }

  async addNewTask(taskName) {
    this.utilUI.checkInputString(taskName);

  }

};
