import * as model from './model';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import resultsView from './views/resultsView';
import paginationView from './views/paginationView';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from "regenerator-runtime";

// Parcel hot module reloading
// if (module.hot) {
//     module.hot.accept()
// }

///////////////////////////////////////
const controlRecipes = async function() {
    try {
        const id = window.location.hash.slice(1);
        if (!id) return false;

        recipeView.renderSpenner();

        // 0) Update results view to mark selected search result
        resultsView.update(model.getSearchResultsPage());

        // 1) Load the recipe
        await model.loadRecipe(id);

        // 2) Render the recipe
        recipeView.render(model.state.recipe);
    } catch (error) {
        recipeView.renderError();
    }
};

const controlSearchResults = async function() {
    try {
        // 1) Get the query from the view
        const query = searchView.getQuery();
        if (!query) return;

        // 2) Load search results
        await model.loadSearchResults(query);

        // 3) Render the results
        resultsView.render(model.getSearchResultsPage());

        // 4) Render the pagination buttons
        paginationView.render(model.state.search);
    } catch (error) {
        console.error(error);
    }
}

const controlPagination = function (goToPage) {
    // 1) Render NEW results
    resultsView.render(model.getSearchResultsPage(goToPage));

    // 2) Render NEW pagination buttons
    paginationView.render(model.state.search);
}

const controlServings = function (newServings) {
        // 1) update the recipe servings (in state)
        model.updateServinsg(newServings);

        // 2) Update (! reRender) the recipe View
        recipeView.update(model.state.recipe);
};

const init = function () {
    recipeView.addHandlerRender(controlRecipes);
    recipeView.addHandlerUpdateServings(controlServings);
    searchView.addHandlerSearch(controlSearchResults);
    paginationView.addHandlerClick(controlPagination);
};
init();
