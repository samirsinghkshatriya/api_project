// === DOM ELEMENTS ===
const searchInput = document.getElementById('searchInput');
const recipesGrid = document.getElementById('recipesGrid');
const randomBtn = document.getElementById('randomBtn');
const allBtn = document.getElementById('allBtn');
const beefBtn = document.getElementById('beefBtn');
const chickenBtn = document.getElementById('chickenBtn');
const dessertBtn = document.getElementById('dessertBtn');

// === EVENT LISTENERS ===
searchInput.addEventListener('input', searchRecipes);
randomBtn.addEventListener('click', getRandomRecipe);
allBtn.addEventListener('click', showAllRecipes);
beefBtn.addEventListener('click', () => filterCategory('Beef'));
chickenBtn.addEventListener('click', () => filterCategory('Chicken'));
dessertBtn.addEventListener('click', () => filterCategory('Dessert'));

// === MAIN FUNCTIONS ===
function searchRecipes() {
    const query = searchInput.value;
    
    if(query.length < 2) {
        recipesGrid.innerHTML = '<div class="empty-state"><p>Type 2+ characters...</p></div>';
        return;
    }
    
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`)
        .then(response => response.json())
        .then(data => {
            showRecipes(data.meals);
        });
}

function filterCategory(category) {
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
        .then(response => response.json())
        .then(data => {
            showRecipes(data.meals);
        });
}

function getRandomRecipe() {
    fetch('https://www.themealdb.com/api/json/v1/1/random.php')
        .then(response => response.json())
        .then(data => {
            showRecipes([data.meals[0]]);  // Show as array with 1 item
        });
}

function showAllRecipes() {
    // Show popular chicken recipes as "all"
    fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=chicken')
        .then(response => response.json())
        .then(data => {
            showRecipes(data.meals);
        });
}

// === HELPER FUNCTIONS ===
function showRecipes(meals) {
    if(!meals || meals.length === 0) {
        recipesGrid.innerHTML = '<div class="empty-state"><p>No recipes found</p></div>';
        return;
    }
    
    let html = '';
    meals.slice(0, 8).forEach(meal => {
        html += createRecipeCard(meal);
    });
    
    recipesGrid.innerHTML = html;
}

function createRecipeCard(meal) {
    return `
        <div class="recipe-card">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <div class="recipe-info">
                <h3>${meal.strMeal}</h3>
                <div class="recipe-tags">
                    ${meal.strCategory ? `<span>🥘 ${meal.strCategory}</span>` : ''}
                    ${meal.strArea ? `<span>🌍 ${meal.strArea}</span>` : ''}
                </div>
                <p>${meal.strInstructions ? meal.strInstructions.substring(0, 120) + '...' : 'No instructions available'}</p>
            </div>
        </div>
    `;
}
