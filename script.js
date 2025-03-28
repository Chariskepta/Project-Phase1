
const categoriesContainer = document.getElementById('categories');
const categoryDisplay = document.getElementById('category-display');
const categoryImage = document.getElementById('category-image');
const categoryTitle = document.getElementById('category-title');
const recipesContainer = document.getElementById('recipes');


fetch('db.json')
  .then(response => response.json())
  .then(data => {
    displayCategories(data.categories);
    
   
    if (data.categories.length > 0) {
      displayRecipes(data.categories[0]);
    }
  })
  .catch(error => {
    console.error('Error loading data:', error);
    recipesContainer.innerHTML = '<p>Failed to load recipes. Please try again later.</p>';
  });


function displayCategories(categories) {
  categoriesContainer.innerHTML = '';
  
  categories.forEach(category => {
    const categoryCard = document.createElement('div');
    categoryCard.className = 'category-card';
    categoryCard.innerHTML = `
      <img src="${category.image}" alt="${category.name}">
      <h2>${category.name}</h2>
    `;
    
    categoryCard.addEventListener('click', () => {
      
      document.querySelectorAll('.category-card').forEach(card => {
        card.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
      });
      categoryCard.style.backgroundColor = 'rgba(132, 220, 198, 0.2)';
      
      displayRecipes(category);
    });
    
    categoriesContainer.appendChild(categoryCard);
  });
}
function displayRecipes(category) {
  
  categoryImage.src = category.image;
  categoryTitle.textContent = category.name;
  categoryDisplay.style.display = 'block';
  
  
  recipesContainer.innerHTML = '';
  
  
  category.recipes.forEach(recipe => {
    const recipeCard = document.createElement('div');
    recipeCard.className = 'recipe-card';
    recipeCard.innerHTML = `
      <img src="${recipe.image}" alt="${recipe.name}">
      <h3>${recipe.name}</h3>
      <p><strong>Ingredients:</strong> ${recipe.ingredients.join(', ')}</p>
      <p><strong>Instructions:</strong> ${recipe.instructions}</p>
      <button class="favorite-btn" data-id="${recipe.id}">❤️ Add to Favorites</button>
    `;
    recipesContainer.appendChild(recipeCard);
  });
  
  
  document.querySelectorAll('.favorite-btn').forEach(btn => {
    btn.addEventListener('click', addToFavorites);
  });
}


function addToFavorites(event) {
  const recipeId = event.target.dataset.id;
  
  fetch('http://localhost:3000/favorites', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      recipeId: recipeId,
      dateAdded: new Date().toISOString() 
    })
  })
  .then(response => response.json())
  .then(data => {
    event.target.textContent = '✓ Added to Favorites!';
    event.target.style.backgroundColor = '#ff9f1c';
    setTimeout(() => {
      event.target.textContent = '❤️ Added to Favorites';
      event.target.style.backgroundColor = '#84dcc6';
    }, 2000);
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Failed to add to favorites. Please try again.');
  });
}