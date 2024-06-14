import * as model from './model.js';
import recipeView from './views/recipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
const controlRecipes = async function() {
    try {
        const id = window.location.hash.slice(1);
        if (!id) return false;

        recipeView.renderSpenner();

        // 1) Load the recipe
        await model.loadRecipe(id);

        // 2) Render the recipe
        recipeView.render(model.state.recipe);
    } catch (error) {
        recipeView.renderError();
    }
};

const init = function () {
    recipeView.addHandlerRender(controlRecipes);
};
init();
