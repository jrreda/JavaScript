import * as model from './model';
import { MODAL_CLOSE_SEC } from "./config";

import recipeView from './views/recipeView';
import searchView from './views/searchView';
import resultsView from './views/resultsView';
import paginationView from './views/paginationView';
import bookmarksView from './views/bookmarksView';
import addRecipeView from './views/addRecipeView';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from "regenerator-runtime";

// Parcel hot module reloading
// if (module.hot) {
//     module.hot.accept()
// }

///////////////////////////////////////
const controlRecipes = async function () {
    try {
        const id = window.location.hash.slice(1);
        if (!id) return;

        recipeView.renderSpinner();

        // 0) Update results view to mark selected search result
        resultsView.update(model.getSearchResultsPage());

        // 1) updating bookmarks view
        bookmarksView.update(model.state.bookmarks);

        // 2) Load the recipe
        await model.loadRecipe(id);

        // 3) Render the recipe
        recipeView.render(model.state.recipe);
    } catch (error) {
        recipeView.renderError();
    }
};

const controlSearchResults = async function () {
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
};

const controlPagination = function (goToPage) {
    // 1) Render NEW results
    resultsView.render(model.getSearchResultsPage(goToPage));

    // 2) Render NEW pagination buttons
    paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
        // 1) update the recipe servings (in state)
        model.updateServinsg(newServings);

        // 2) Update (! reRender) the recipe View
        recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
    if (! model.state.recipe.bookmarked) {
        // Add new bookmark
        model.addBookmark(model.state.recipe);
    } else {
        // Remove bookmark
        model.deleteBookmark(model.state.recipe.id);
    }

    // 2) Update recipe view
    recipeView.update(model.state.recipe);

    // 3) Render the bookmarks view
    bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
    bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
    try {
        // show loading spinner
        addRecipeView.renderSpinner();

        // upload new recipe data
        await model.uploadRecipe(newRecipe);
        console.log(model.state.recipe);

        // render the new recipe
        recipeView.render(model.state.recipe);

        // Flash Success message
        addRecipeView.renderSuccess();

        // Render bookmark view
        bookmarksView.render(model.state.bookmarks);

        // Change ID in URL
        window.history.pushState(null, '', `#${model.state.recipe.id}`);

        // close the Form widnow
        setTimeout(() => {
            addRecipeView.toggleWindow();
        }, MODAL_CLOSE_SEC * 1000);
    } catch (error) {
        console.error('💥', error);
        addRecipeView.renderError(error.message);
    }
};

const init = function () {
    bookmarksView.addHandlerRender(controlBookmarks);
    recipeView.addHandlerRender(controlRecipes);
    recipeView.addHandlerUpdateServings(controlServings);
    recipeView.addHandlerAddBookmark(controlAddBookmark);
    searchView.addHandlerSearch(controlSearchResults);
    paginationView.addHandlerClick(controlPagination);
    addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
