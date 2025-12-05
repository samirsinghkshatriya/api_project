# Recipe Finder using TheMealDB API


## Introduction

A **Recipe Finder** is a web application that searches recipes using TheMealDB free API. The application finds recipes by name, shows recipe images, extracts ingredients from API response, and displays in cards. This project teaches essential JavaScript concepts starting with simple fetch() calls before building UI.

***

## Core Concepts Covered

This project teaches four essential JavaScript concepts:

- **Basic fetch() Calls**: Simple HTTP requests to free TheMealDB endpoints
- **TheMealDB API Structure**: Understanding JSON response format
- **Extract Recipe Data**: Get name, image, ingredients from API objects
- **Display in Console**: Print results before creating UI elements

***

## Concept 1: Basic fetch() Calls


***

### What is fetch()?

`fetch()` makes HTTP GET requests to APIs and returns a Promise with JSON data. Use `.then()` chain to get the data step by step.

***

### Common fetch() Pattern:

```javascript
fetch('API_URL')
    .then(response => response.json())
    .then(data => console.log(data));
```


***

### Example 1: Search Recipes by Name

**Purpose:** Call search endpoint and print recipes to console.

```javascript
// Search for "chicken" recipes
fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=chicken')
    .then(response => response.json())
    .then(data => {
        // Why data.meals exists:
        // - API always returns {meals: []} structure
        // - meals array contains recipe objects
        // - Empty search returns null
        
        console.log('All recipes:', data.meals);
        console.log('Recipe count:', data.meals.length);
    });
```


***

### Example 2: Get Random Recipe

**Purpose:** Fetch one random recipe from API.

```javascript
// Get single random recipe
fetch('https://www.themealdb.com/api/json/v1/1/random.php')
    .then(response => response.json())
    .then(data => {
        // Why data.meals[0]:
        // - Random endpoint returns 1 recipe
        // - Always at index 0 in meals array
        
        const recipe = data.meals[0];
        console.log('Random recipe:', recipe);
        console.log('Recipe name:', recipe.strMeal);
    });
```


***

**Key Takeaways:**

- Use `fetch(URL).then().then()` for simple API calls
- API data is always at `data.meals`
- Console.log first to see structure
- No async/await or try-catch needed

***

## Concept 2: TheMealDB API Structure


***

### API Response Format

Every endpoint returns `{meals: []}`. Search returns multiple recipes, random/lookup returns 1 recipe at `meals[0]`.

***

### Example 1: Print Search Response Structure

**Purpose:** Log complete API response to understand data format.

```javascript
fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=pizza')
    .then(response => response.json())
    .then(data => {
        const firstRecipe = data.meals[0];
        
        // Why we log specific properties:
        // - See exactly what fields exist
        // - Plan which data to extract
        // - Understand naming pattern
        
        console.log('Recipe name:', firstRecipe.strMeal);
        console.log('Recipe image:', firstRecipe.strMealThumb);
        console.log('Recipe ID:', firstRecipe.idMeal);
        console.log('Category:', firstRecipe.strCategory);
    });
```


***

### Example 2: List All Categories

**Purpose:** Get category list from categories endpoint.

```javascript
fetch('https://www.themealdb.com/api/json/v1/1/categories.php')
    .then(response => response.json())
    .then(data => {
        // Categories endpoint structure:
        // {categories: [{strCategory: "Beef", strCategoryThumb: "..."}]}
        
        console.log('All categories:', data.categories);
        data.categories.forEach(cat => {
            console.log(`${cat.strCategory}: ${cat.strCategoryThumb}`);
        });
    });
```


***

**Key Takeaways:**

- Search: `data.meals[]` - multiple recipes
- Random: `data.meals[0]` - single recipe
- Categories: `data.categories[]` - category list
- Always check `console.log(data)` first

***

## Concept 3: Extract Recipe Data


***

### Key Recipe Properties

Each recipe has `strMeal`, `strMealThumb`, `strCategory`, and ingredients as `strIngredient1-20` + `strMeasure1-20`.

***

### Example 1: Extract Basic Recipe Info

**Purpose:** Get name, image, category from one recipe.

```javascript
fetch('https://www.themealdb.com/api/json/v1/1/random.php')
    .then(response => response.json())
    .then(data => {
        const recipe = data.meals[0];
        
        // Create clean recipe object
        const cleanRecipe = {
            name: recipe.strMeal,
            image: recipe.strMealThumb,
            category: recipe.strCategory,
            area: recipe.strArea,
            id: recipe.idMeal
        };
        
        // Why we create clean object:
        // - API has 50+ messy properties
        // - UI needs only 5-8 fields
        // - Easier to work with
        
        console.log('Clean recipe:', cleanRecipe);
    });
```


***

### Example 2: Extract Ingredients List

**Purpose:** Combine ingredient names + measures into list.

```javascript
fetch('https://www.themealdb.com/api/json/v1/1/random.php')
    .then(response => response.json())
    .then(data => {
        const recipe = data.meals[0];
        const ingredients = [];
        
        // Ingredients stored as strIngredient1 + strMeasure1, etc.
        for(let i = 1; i <= 20; i++) {
            const ingredient = recipe[`strIngredient${i}`];
            const measure = recipe[`strMeasure${i}`];
            
            // Why both must exist:
            // - Some have ingredient but no measure
            // - Some have measure but no ingredient
            if(ingredient && measure) {
                ingredients.push(`${measure} ${ingredient}`);
            }
        }
        
        console.log('Ingredients list:', ingredients.slice(0, 8));
    });
```


***

**Key Takeaways:**

- Recipe basics: `strMeal`, `strMealThumb`, `strCategory`
- Ingredients: Loop `strIngredient1-20` + `strMeasure1-20`
- Create clean objects from messy API data
- Use template literals for ingredient strings

***

## Concept 4: Display in Console


***

### Console Logging Patterns

Print structured data to browser console before building HTML UI.

***

### Example 1: Multiple Recipe Search Results

**Purpose:** Search and print 5 recipe summaries.

```javascript
fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=chicken')
    .then(response => response.json())
    .then(data => {
        console.log('=== CHICKEN RECIPES ===');
        
        // Why .slice(0,5):
        // - API might return 50+ results
        // - Console easier to read with 5
        // - Shows pattern without overload
        
        data.meals.slice(0,5).forEach((recipe, index) => {
            console.log(`${index+1}. ${recipe.strMeal}`);
            console.log(`   Image: ${recipe.strMealThumb}`);
            console.log(`   Category: ${recipe.strCategory}`);
            console.log('---');
        });
    });
```


***

### Example 2: Complete Recipe Summary

**Purpose:** Print one recipe with all key details.

```javascript
fetch('https://www.themealdb.com/api/json/v1/1/lookup.php?i=52772')
    .then(response => response.json())
    .then(data => {
        const recipe = data.meals[0];
        
        console.log('🍗 COMPLETE RECIPE');
        console.log('Name:', recipe.strMeal);
        console.log('Category:', recipe.strCategory);
        console.log('Area:', recipe.strArea);
        console.log('Image:', recipe.strMealThumb);
        
        console.log('\n🥘 INGREDIENTS:');
        for(let i = 1; i <= 10; i++) {
            const ing = recipe[`strIngredient${i}`];
            const measure = recipe[`strMeasure${i}`];
            if(ing && measure) console.log(`  • ${measure} ${ing}`);
        }
    });
```


***

**Key Takeaways:**

- Use `console.log('=== HEADER ===')` for sections
- `.slice(0,5)` limits long results
- `forEach()` loops for multiple recipes
- Print ingredients in numbered loop

***

# Recipe Finder - HTML, CSS, \& JS Structure

## Core Concepts Covered

This project teaches four essential concepts:

- **HTML Semantic Structure**: Header, nav, main, footer with proper tags
- **Flexbox Layout**: Navigation and search bar alignment
- **CSS Grid**: Responsive recipe card grid
- **Responsive Media Queries**: Mobile, tablet, desktop breakpoints

***

## Concept 1: HTML Semantic Structure


***

### Semantic HTML Tags

Use proper HTML5 tags for accessibility and SEO.

***

### Example 1: Complete Page Structure

**Purpose:** Create header, nav, main content, and footer layout.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🍳 Recipe Finder</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <!-- Header with logo and title -->
    <header class="header">
        <div class="container">
            <h1>🍳 Recipe Finder</h1>
            <p>Discover recipes from TheMealDB API</p>
        </div>
    </header>

    <!-- Navigation bar -->
    <nav class="navbar">
        <div class="container">
            <button id="allBtn" class="nav-btn active">All Recipes</button>
            <button id="beefBtn" class="nav-btn">Beef</button>
            <button id="chickenBtn" class="nav-btn">Chicken</button>
            <button id="dessertBtn" class="nav-btn">Dessert</button>
        </div>
    </nav>

    <!-- Main content -->
    <main class="main">
        <div class="container">
            <!-- Search section -->
            <div class="search-section">
                <input type="text" id="searchInput" placeholder="Search recipes...">
                <button id="randomBtn">🎲 Random</button>
            </div>

            <!-- Results container -->
            <div id="recipesGrid" class="recipes-grid">
                <div class="empty-state">
                    <p>🔍 Search recipes or click a category</p>
                </div>
            </div>
        </div>
    </main>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <p>&copy; 2025 Recipe Finder | Powered by TheMealDB API</p>
        </div>
    </footer>

    <script src="script.js"></script>
</body>
</html>
```


***

**Why Semantic Tags:**

- `<header>`: Page branding and title
- `<nav>`: Navigation buttons
- `<main>`: Primary content area
- `<footer>`: Copyright and credits

***

## Concept 2: Flexbox Layout


***

### Flexbox for Navigation \& Search

Flexbox aligns items horizontally and handles responsive wrapping.

***

### Example 1: Navigation Flexbox

**Purpose:** Create horizontal button navigation that wraps on mobile.

```css
/* Container for all content */
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

/* Navigation flexbox */
.navbar {
    background: #667eea;
    padding: 15px 0;
}

.navbar .container {
    display: flex;           /* Why flex: aligns buttons horizontally */
    flex-wrap: wrap;         /* Why wrap: buttons move to new line on small screens */
    gap: 10px;              /* Space between buttons */
    justify-content: center; /* Center align buttons */
}

.nav-btn {
    padding: 12px 24px;      /* Button padding */
    background: rgba(255,255,255,0.2);
    color: white;
    border: none;
    border-radius: 25px;
    cursor: pointer;
    font-size: 16px;
}

.nav-btn.active {
    background: white;
    color: #667eea;
}
```


***

**Flexbox Properties Explained:**

- `display: flex`: Makes container a flex parent
- `flex-wrap: wrap`: Items wrap to new line
- `justify-content: center`: Centers items horizontally
- `gap: 10px`: Space between flex items

***

## Concept 3: CSS Grid for Recipes


***

### Grid Layout for Recipe Cards

CSS Grid creates responsive columns that automatically adjust.

***

### Example 1: Responsive Recipe Grid

**Purpose:** Create auto-fitting grid that works on all screen sizes.

```css
.recipes-grid {
    display: grid;                    /* Why grid: perfect for 2D layouts */
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                                      /* Why auto-fill: creates as many columns as fit */
                                      /* Why minmax(300px, 1fr): minimum 300px, grow to fill */
    gap: 25px;                        /* Space between grid items */
    margin-top: 30px;
}

.recipe-card {
    background: white;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 8px 25px rgba(0,0,0,0.1);
}

.recipe-card img {
    width: 100%;
    height: 200px;
    object-fit: cover;                /* Why cover: fills space without distortion */
}
```


***

**Grid Properties Explained:**

- `repeat(auto-fill, minmax(300px, 1fr))`: Auto columns, min 300px each
- `gap: 25px`: Space between cards
- `1fr`: Fractional unit - grows to fill space

***

## Concept 4: Responsive Media Queries


***

### Breakpoint System

Media queries adjust layout for mobile, tablet, desktop.

***

### Example 1: Complete Responsive CSS

**Purpose:** Adapt layout for all device sizes.

```css
/* Mobile First - default styles work on phones */

/* Tablet: 768px+ */
@media (max-width: 768px) {
    .navbar .container {
        flex-direction: column;       /* Stack buttons vertically */
        align-items: center;
    }
    
    .search-section {
        flex-direction: column;       /* Stack search input + button */
    }
    
    .recipes-grid {
        grid-template-columns: 1fr;   /* Single column on tablet */
        gap: 20px;
    }
}

/* Laptop: 1024px+ */
@media (min-width: 769px) and (max-width: 1024px) {
    .recipes-grid {
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    }
}

/* Large Desktop: 1200px+ */
@media (min-width: 1025px) {
    .container {
        padding: 0 40px;              /* More padding on large screens */
    }
}
```


***

**Key Takeaways:**

- Mobile-first: Write mobile styles first
- `@media (max-width: 768px)`: Tablet/mobile
- `flex-direction: column`: Stack vertically
- Grid adapts automatically between breakpoints

***
## Concept 5: DOM Element Selection


***

### Get Elements by ID

Select HTML elements using `document.getElementById()`.

***

### Example 1: Select All Elements

**Purpose:** Get references to search input, buttons, and grid container.

```javascript
// Get all elements once at start
const searchInput = document.getElementById('searchInput');
const recipesGrid = document.getElementById('recipesGrid');
const randomBtn = document.getElementById('randomBtn');
const allBtn = document.getElementById('allBtn');
const beefBtn = document.getElementById('beefBtn');
const chickenBtn = document.getElementById('chickenBtn');
const dessertBtn = document.getElementById('dessertBtn');

// Why getElementById:
// - Fastest DOM selection method
// - Returns single element directly
// - No need for querySelector for IDs
```


***

**Key Takeaways:**

- Use `getElementById()` for elements with `id`
- Store references in variables at top
- Use these variables throughout code

***

## Concept 6: Event Listeners


***

### Button Click Handlers

Add `click` events to buttons using `addEventListener()`.

***

### Example 1: Button Event Listeners

**Purpose:** Connect buttons to search and category functions.

```javascript
// Search input event
searchInput.addEventListener('input', searchRecipes);

// Button events
randomBtn.addEventListener('click', getRandomRecipe);
allBtn.addEventListener('click', showAllRecipes);
beefBtn.addEventListener('click', () => filterCategory('Beef'));
chickenBtn.addEventListener('click', () => filterCategory('Chicken'));
dessertBtn.addEventListener('click', () => filterCategory('Dessert');

// Why arrow functions for buttons:
// - Pass parameter to filterCategory
// - Keep event listener simple
// - Clean syntax
```


***

## Concept 7: Simple fetch() Calls


***

### Basic API Requests

Use `fetch().then().then()` to get recipe data.

***

### Example 1: Search Function

**Purpose:** Search recipes by input value.

```javascript
function searchRecipes() {
    const query = searchInput.value;
    
    if(query.length < 2) {
        recipesGrid.innerHTML = '<div class="empty-state"><p>Type 2+ characters...</p></div>';
        return;
    }
    
    // Simple fetch call
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`)
        .then(response => response.json())
        .then(data => {
            showRecipes(data.meals);
        });
}

// Why template literal ${query}:
// - Puts search term in URL
// - Creates: search.php?s=chicken
```


***

### Example 2: Category Filter

**Purpose:** Filter recipes by category.

```javascript
function filterCategory(category) {
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
        .then(response => response.json())
        .then(data => {
            showRecipes(data.meals);
        });
}
```


***

**Key Takeaways:**

- `fetch(URL).then().then()` pattern
- Template literals for dynamic URLs
- Pass category name directly
- Call `showRecipes()` with `data.meals`

***

## Concept 8: Dynamic HTML Display


***

### Recipe Card Creation

Create HTML strings and set `innerHTML`.

***

### Example 1: Show Recipes Function

**Purpose:** Display recipes in grid from API data.

```javascript
function showRecipes(meals) {
    if(!meals || meals.length === 0) {
        recipesGrid.innerHTML = '<div class="empty-state"><p>No recipes found</p></div>';
        return;
    }
    
    // Create HTML for all recipes
    let html = '';
    meals.slice(0, 8).forEach(meal => {  // Show max 8 recipes
        html += createRecipeCard(meal);
    });
    
    recipesGrid.innerHTML = html;
}
```


***

### Example 2: Single Recipe Card

**Purpose:** Create HTML for one recipe card.

```javascript
function createRecipeCard(meal) {
    return `
        <div class="recipe-card">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <div class="recipe-info">
                <h3>${meal.strMeal}</h3>
                <div class="recipe-tags">
                    ${meal.strCategory ? `<span>${meal.strCategory}</span>` : ''}
                </div>
                <p>${meal.strInstructions ? meal.strInstructions.substring(0, 100) + '...' : 'No instructions'}</p>
            </div>
        </div>
    `;
}
```


***

**Key Takeaways:**

- `forEach()` loops through `meals` array
- Template literals create HTML strings
- `slice(0,8)` limits to 8 recipes
- `substring(0,100)` shortens instructions

***
