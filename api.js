APP_ID = "89b1c705"
APP_KEY = "017d2109dee809b64487a67e1a7464f3"
URL = "https://api.edamam.com/api/recipes/v2?type=public"


//API search functionality
let ing = document.querySelector("#recipeIngredient");
let mealType = document.querySelector("#mealType");
let dietType = document.querySelector("#dietType");
let cuisineType = document.querySelector("#cuisine");
let restrictions = document.querySelector("#restrictions");
let apiSearchBtn = document.querySelector("#apiBtn");
const recipeList = document.querySelector('#recipe-list');
const noRecipes = document.getElementById('no-recipes');
const form = document.querySelector('form');
let recipes = [];


// Add event listener to the Api search button
apiSearchBtn.addEventListener("click", searchApi);


function searchRecipes(ingredient, paramDict) {
    // Call the API with query and credentials
    let url = URL;
    let params = {
        "q": ingredient,
        "app_id": APP_ID,
        "app_key": APP_KEY
    }
    // Check if the user selected any filtering options
    for(arg in paramDict) {
        if(paramDict[arg] != "" && paramDict[arg] != [] && paramDict[arg] != [""]) {
            params[arg] = paramDict[arg]
        }
    }
    // Create API call url from params
    for(let param in params) {
        url += "&" + param + "=" + params[param];
    }

    // Get data from the API
    fetch(url)
    .then(response => {
        // Check response status code
        if(response.status != 200) {
            throw new Error("Bad Server Response");
        }
        const data = response.json();
        return data;
    })
    .then(d => {
        return extractRecipes(d);
    });
}

function extractRecipes(data) {
    // Extract recipe list from JSON response
    let ingValue = ing.value;
    let message = "";
    if(ingValue && data.hits.length < 1) {
        message = `No recipes were found for ${ingValue}`;
        // Show message to the user, reset recipes list
        noRecipes.textContent = message;
        recipes = [];
    }
    for(let recipe of data.hits) {
        // Create recipe object from API data
        recipes.push(
            {
                "name": recipe.recipe.label,
                "method": recipe.recipe.url,
                "ingredients": recipe.recipe.ingredientLines,
                "calories": recipe.recipe.calories,
                "cuisine": recipe.recipe.cuisineType,
                "diet": recipe.recipe.dietLabels,
                "meal": recipe.recipe.mealType,
                "time": recipe.recipe.totalTime,
                "servings": recipe.recipe.yield,
                "photo": recipe.recipe.image
            }
        )
    };
    // Display returned recipes and clear the form
    displayRecipes();
    form.reset()
    return recipes;
}

function displayRecipes() {
    // Display results
    recipeList.innerHTML = '';
    recipes.forEach((recipe, index) => {
        const recipeDiv = document.createElement('div');

        recipeDiv.innerHTML = `
            <h3>${recipe.name}</h3>
            <p><strong>Ingredients:</strong></p>
            <ul>
                ${recipe.ingredients.map(ingr => `<li>${ingr}</li>`).join('')}
            </ul>
            <p><strong>Method:</strong></p>
            <p><a href=${recipe.method}>Go to recipe</a></p>
            <button class="delete-button" data-index="${index}">Delete</button>`;

        recipeDiv.classList.add('recipe');

        recipeList.appendChild(recipeDiv);
    });

    noRecipes.style.display = recipes.length > 0 ? 'none' : 'flex';
}

function handleDelete(event){
    // Add delete recipe functionality
    if(event.target.classList.contains('delete-button')) {
        const index = event.target.dataset.index;
        recipes.splice(index,1);
        displayRecipes();
      }  
    }

recipeList.addEventListener('click', handleDelete);


function searchApi(e) {
    // Main functionality triggered by API search button
    e.preventDefault();
    // Reset recipes list
    recipes = [];
    // Get input data from form
    let ingValue = ing.value;
    let inputs =  getUserData();
    // Make the API call with that data
    let result = searchRecipes(ingValue, inputs);
    return result
}

function getUserData() {
    // Get all the values from API search form
    let ingredient = ing.value;
    let meals = "";
    let cuisines = "";
    let diets = "";
    let health = "";
    if(!ingredient) {
        // Show the correct message if the required field - the ingredient is missing
        noRecipes.textContent = "An ingredient is required!";
        return
    }
    // Get select option values
    meals = mealType.value;
    cuisines = cuisineType.value;
    diets = dietType.value;
    health = restrictions.value;
    // Set the params object
    let inputs = {
        "mealType": meals,
        "health": health,
        "cuisineType": cuisines,
        "diet": diets
    }
    return inputs
}


