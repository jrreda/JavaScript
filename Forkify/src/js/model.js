import { async } from "regenerator-runtime";

export const state = {
    recipe: {},
};

export const loadRecipe = async function (id) {
    try {
        const res  = await fetch(`https://forkify-api.herokuapp.com/api/v2/recipes/${id}`);
        const data = await res.json();
        
        if (!res.ok) throw new Error(`${data.message}`);

        const {recipe} = data.data; 
        state.recipe = {
            id         : recipe.id,
            title      : recipe.title,
            publisher  : recipe.publisher,
            sourceUrl  : recipe.source_url,
            image      : recipe.image_url,
            servings   : recipe.servings,
            ingredients: recipe.ingredients,
            cookingTime: recipe.cooking_time,
        }

        console.log(state.recipe);
    } catch (error) {
        alert('Error: ' + error);
    }
};