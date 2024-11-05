// Global Variables to Track Total Nutrition and Stored Data
let totalCalories = 0;
let totalProtein = 0;
let totalFats = 0;

// Nutrient Data for Each Food Item
const foodData = {
    paneer: { calories: 321, protein: 18, fats: 24 },
    soyaChunks: { calories: 345, protein: 52, fats: 0.5 },
    rice: { calories: 130, protein: 2.7, fats: 0.3 },
    kalaChana: { calories: 352, protein: 18, fats: 4.28 },
    chickpeas: { calories: 364, protein: 19, fats: 6 },
    roti: { calories: 264, protein: 7.85, fats: 9.2 },
    dahi: { calories: 98, protein: 11, fats: 4.3 },
    rajma: { calories: 333, protein: 24, fats: 2.21 },
    milk: { calories: 42, protein: 3.4, fats: 1 },
    eggs: { calories: 74, protein: 6, fats: 5 },  // Egg calories, protein, fats are for 1 egg
    chicken: { calories: 239, protein: 27, fats: 14 },
    tea: { calories: 100, protein: 0, fats: 0 },  // Tea calories, protein, fats are for 1 cup
    rohu: { calories: 80, protein: 16.6, fats: 1.4 },
};

// Load Existing Progress from Local Storage
let dailyData = JSON.parse(localStorage.getItem('dailyProgress')) || [];

// Function to Add Food Item to the List
function addFood() {
    const foodItem = document.getElementById('food').value;
    const quantity = parseInt(document.getElementById('quantity').value);

    if (!quantity || quantity <= 0) {
        alert('Please enter a valid quantity.');
        return;
    }

    let foodCalories = 0;
    let foodProtein = 0;
    let foodFats = 0;

    // Check if the food item is Tea or Egg, handle them differently
    if (foodItem === 'eggs' || foodItem === 'tea') {
        // For Eggs and Tea, use the per unit values (no scaling by quantity/100)
        foodCalories = foodData[foodItem].calories * quantity; // Multiply by quantity as they are 1 unit servings
        foodProtein = foodData[foodItem].protein * quantity;
        foodFats = foodData[foodItem].fats * quantity;
    } else {
        // For other foods, calculate based on quantity and standard per-100g values
        const food = foodData[foodItem];
        foodCalories = (food.calories * quantity) / 100;
        foodProtein = (food.protein * quantity) / 100;
        foodFats = (food.fats * quantity) / 100;
    }

    // Update Total Nutrition for the Day
    totalCalories += foodCalories;
    totalProtein += foodProtein;
    totalFats += foodFats;

    // Update the Total Nutrition Display
    document.getElementById('total-calories').textContent = totalCalories.toFixed(2);
    document.getElementById('total-protein').textContent = totalProtein.toFixed(2);
    document.getElementById('total-fats').textContent = totalFats.toFixed(2);

    // Display Added Food in the List (Food List in the UI)
    const foodList = document.getElementById('food-list');
    const listItem = document.createElement('li');
    listItem.innerHTML = `${foodItem} - ${quantity} unit(s) | Calories: ${foodCalories.toFixed(2)} kcal | Protein: ${foodProtein.toFixed(2)}g | Fats: ${foodFats.toFixed(2)}g`;
    foodList.appendChild(listItem);
}

// Function to Reset the Progress
function resetProgress() {
    totalCalories = 0;
    totalProtein = 0;
    totalFats = 0;

    // Update Total Nutrition Display
    document.getElementById('total-calories').textContent = '0';
    document.getElementById('total-protein').textContent = '0';
    document.getElementById('total-fats').textContent = '0';

    // Clear the Food List Display
    document.getElementById('food-list').innerHTML = '';
}

// Function to Store Today's Progress to Local Storage
function storeProgress() {
    const date = new Date().toLocaleDateString();
    dailyData.push({
        date: date,
        calories: totalCalories,
        protein: totalProtein,
        fats: totalFats,
    });
    
    // Store the Data in Local Storage
    localStorage.setItem('dailyProgress', JSON.stringify(dailyData));

    // Optionally Reset the Totals
    resetProgress();
}

// Function to View the Progress History
function seeProgress() {
    const progressPage = document.getElementById('progress-page');
    const progressList = document.getElementById('progress-list');

    // Clear Existing Rows
    progressList.innerHTML = '';

    // Populate the Progress Table from Local Storage
    dailyData.forEach((entry, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${entry.date}</td>
            <td>${entry.calories.toFixed(2)} kcal</td>
            <td>${entry.protein.toFixed(2)} g</td>
            <td>${entry.fats.toFixed(2)} g</td>
            <td><button onclick="deleteProgress(${index})">Delete</button></td>
        `;
        progressList.appendChild(row);
    });

    // Switch to the Progress Page
    progressPage.style.display = 'block';
    document.querySelector('.container').style.display = 'none';
}

// Function to Delete an Entry from Progress History
function deleteProgress(index) {
    // Remove the Entry from the Data
    dailyData.splice(index, 1);

    // Update Local Storage
    localStorage.setItem('dailyProgress', JSON.stringify(dailyData));

    // Re-render the Progress List
    seeProgress();
}

// Function to Go Back to Main Page
function goBack() {
    document.getElementById('progress-page').style.display = 'none';
    document.querySelector('.container').style.display = 'block';
}