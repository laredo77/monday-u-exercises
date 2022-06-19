const express = require('express');

const {
    //addTask,
    getAllTasks,
    addNewTask,
    deleteTask,
    deleteAllTasks,
    getPokemonsMap,
    initClient,
    // getTask,
    // deleteTask,
    // deleteAllTasks,
    // lexicographicallySort,
    // chronologicalSort,
} = require('../controllers/routesController');

const todoRouter = express.Router();

// todoRouter.get('/', (req, res) => {
//     res.status(200).json("Welcome");
// })

todoRouter.get('/', initClient);
todoRouter.get('/all', getAllTasks);
todoRouter.post('/', addNewTask);
todoRouter.delete('/', deleteTask);
todoRouter.delete('/all', deleteAllTasks);
todoRouter.get('/pokemons', getPokemonsMap);

module.exports = todoRouter;



// const express = require('express');
// const {validateSchema, jediSchema} = require("../middleware/validation");
// const auth = require('../middleware/auth');
// const {
//     createJedi,
//     getAll,
//     getJedi,
//     replaceJedi,
//     deleteJedi,
// } = require('../controllers/jediController');

// const jediRouter = express.Router();

// //TODO 6 Add validation schema in proper request
// //TODO 8 Add auth middleware to all routes
// jediRouter.get('/', auth, getAll);
// jediRouter.get('/:id', auth, getJedi);
// jediRouter.post('/', auth, validateSchema(jediSchema), createJedi);
// jediRouter.put('/:id', auth, replaceJedi);
// jediRouter.delete('/:id', auth, deleteJedi);

// module.exports = jediRouter;