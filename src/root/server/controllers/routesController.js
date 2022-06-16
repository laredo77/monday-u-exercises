const ItemManager = require('../../server/services/ItemManager')
const itemManager = new ItemManager();

async function getAllTasks(req, res) {

    // let data = await jediService.getAll();
    // if (!data) data = [];
    res.status(200).json("hello from routesController");
    // const data = await item.getAll();
    // if (!data) data = []
    // res.status(200).json(data);
}

async function addNewTask(req, res) {
    // await itemManager.checkInputString(req.params.id);
    // res.status(200).json(req.body);

    // console.log("create task");
    // const response = await item.addTask(req.body);
    // console.log(response);
    // res.status(200).json(response);

    const response = await itemManager.addTask(req.body);
    res.status(200).json(response);

}

async function deleteTask(req, res) {

}

async function deleteAllTasks(req, res) {

}

module.exports = {
    getAllTasks,
    addNewTask,
    deleteTask,
    deleteAllTasks
};

// const jediService = require("../service/JediService");

// async function createJedi(req, res) {
//     await jediService.addJedi(req.body);
//     res.status(200).json(req.body);
// }


// async function getJedi(req, res) {
//     let jediId = Number.parseInt(req.params.id);
//     //TODO 1. Turn it to error with proper status and throw it
//     if (isNaN(jediId)){
//         let error = Error();
//         error.statusCode = 400
//         error.message = 'Wrong parameters'
//         throw error
//     }

//     const jedi = await jediService.getJedi(jediId);

//     if (!jedi) {
//         let error = Error();
//         error.statusCode = 404
//         error.message = 'Not found'
//         throw error
//     }

//     res.status(200).json(jedi);
// }

// async function getAll(req, res) {
//     let data = await jediService.getAll();
//     if (!data) data = [];
//     res.status(200).json(data);
// }

// async function replaceJedi(req, res) {
//     const jediId = Number.parseInt(req.params.id);
//     if (isNaN(jediId)) {
//         let error = Error();
//         error.statusCode = 400
//         error.message = 'Wrong parameters'
//         throw error
//     }

//     const data = await jediService.replaceJedi(jediId, req.body);
//     res.status(200).json(data);
// }

// async function deleteJedi(req, res) {
//     let jediId = Number.parseInt(req.params.id);
//     //TODO 4. Turn it to error with proper status and throw it
//     if (isNaN(jediId)) {
//         let error = Error();
//         error.statusCode = 400
//         error.message = 'Wrong parameters'
//         throw error
//     }

//     const data = await jediService.deleteJedi(jediId);
//     res.status(200).json(data);
// }

// module.exports = {
//     createJedi,
//     deleteJedi,
//     getAll,
//     getJedi,
//     replaceJedi
// };