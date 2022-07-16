
import PropTypes from 'prop-types';

function Todo({ItemName, PokemonId, status}) {

    // const onDeleteTask = async () => {
    //     //await ItemClient.deleteTask(ItemName);
    // }
    
}

Todo.PropTypes = {
    ItemName: PropTypes.string,
    PokemonId: PropTypes.string,
    status: PropTypes.bool
}

export default Todo

