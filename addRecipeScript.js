// Add Javascript here
const recipeList = document.querySelector('#recipe-list');
const noRecipes = document.getElementById('no-recipes');
const form = document.querySelector('form');
let recipes = [];

function handleSubmit(event) {
    // Prevent default form submission behavior
    event.preventDefault();

    // Get recipe name, ingredients, and method input values
    const nameInput = document.querySelector('#recipe-name');
    const ingrInput = document.querySelector('#recipe-ingredients');
    const methodInput = document.querySelector('#recipe-method');
    const name = nameInput.value.trim();
    const ingredients = ingrInput.value.trim().split(',').map(i => i.trim());
    const method = methodInput.value.trim();


    if (name && ingredients.length > 0 && method) {
        const newRecipe = {
            name,
            ingredients,
            method
        };
        recipes.push(newRecipe);
    }

    nameInput.value = '';
    ingrInput.value = '';
    methodInput.value = '';
    displayRecipes()
}

function displayRecipes() {
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
            <p>${recipe.method}</p>
            <button class="delete-button" data-index="${index}">Delete</button>`;


        recipeDiv.classList.add('recipe');

        recipeList.appendChild(recipeDiv);
    });

    noRecipes.style.display = recipes.length > 0 ? 'none' : 'flex';
}

function handleDelete(){
if(event.target.classList.contains('delete-button')) {
    const index = event.target.dataset.index;
    recipes.splice(index,1);
    displayRecipes();
  }  
}
form.addEventListener('submit', handleSubmit);
recipeList.addEventListener('click', handleDelete);