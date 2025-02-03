const breadRecipes = {
    white: {
        extraIngredients: [],
        instructions: []
    },
    oat: {
        extraIngredients: [
            { name: "Rolled oats", percentage: 15 },
            { name: "Honey", percentage: 5 },
            { name: "Oat flour", percentage: 10 }
        ],
        instructions: [
            "Toast oats at 180°C for 5 minutes before mixing",
            "Add honey during the autolyse phase",
            "Use oat flour in the final shaping dusting"
        ]
    },
    multigrain: {
        extraIngredients: [
            { name: "Mixed seeds (sunflower, flax, sesame)", percentage: 10 },
            { name: "Whole wheat flour", percentage: 20 },
            { name: "Malted grains", percentage: 5 }
        ],
        instructions: [
            "Soak seeds in warm water for 1 hour before mixing",
            "Replace 20% of main flour with whole wheat flour",
            "Add malted grains during final mix"
        ]
    },
    cheddar: {
        extraIngredients: [
            { name: "Sharp cheddar cheese", percentage: 20 },
            { name: "Jalapeño peppers", percentage: 5 },
            { name: "Smoked paprika", percentage: 1 }
        ],
        instructions: [
            "Cube cheese into 1cm pieces",
            "Dice jalapeños (remove seeds for milder flavor)",
            "Mix paprika into final dough during folding"
        ]
    }
};

let isCelsius = true;

// Conversion and calculation functions
function convertToCelsius(fahrenheit) {
    return (fahrenheit - 32) * 5/9;
}

function toggleUnit() {
    const tempInput = document.getElementById('temperature');
    const currentTemp = parseFloat(tempInput.value);
    
    if(isCelsius) {
        tempInput.value = Math.round(currentTemp * 9/5 + 32);
    } else {
        tempInput.value = Math.round((currentTemp - 32) * 5/9);
    }
    isCelsius = !isCelsius;
    
    if(document.getElementById('results').innerHTML) {
        generateRecipe();
    }
}

document.getElementById('hydration').addEventListener('input', (e) => {
    document.getElementById('hydrationValue').textContent = e.target.value;
});

function calculateBulkTime(temp) {
    const baseTemp = 24;
    const baseTime = 240;
    return Math.round(baseTime * Math.pow(2.5, (baseTemp - temp)/10));
}

function calculateFeedingTime(temp) {
    const baseTemp = 22;
    const baseTime = 720;
    const adjustedTime = baseTime * Math.pow(2.5, (baseTemp - temp)/10);
    return Math.max(360, Math.round(adjustedTime));
}

function formatDuration(minutes) {
    const hours = Math.floor(minutes/60);
    const mins = minutes % 60;
    return `${hours}h${mins.toString().padStart(2, '0')}`;
}

function generateRecipe() {
    const breadType = document.getElementById('breadType').value;
    const loaves = parseInt(document.getElementById('loaves').value);
    const doughWeightPerLoaf = parseInt(document.getElementById('doughWeight').value);
    const hydration = parseInt(document.getElementById('hydration').value);
    const tempInput = parseFloat(document.getElementById('temperature').value);
    const starterType = document.getElementById('starterType').value;

    // Constants
    const SALT_PERCENTAGE = 0.02;
    const STARTER_RATIO = 0.2;
    const totalDough = doughWeightPerLoaf * loaves;

    // Calculate total flour (base 100%)
    const totalFlour = totalDough / (1 + (hydration/100) + SALT_PERCENTAGE + STARTER_RATIO);

    // Calculate other components
    const totalWater = totalFlour * (hydration/100);
    const salt = totalFlour * SALT_PERCENTAGE;
    const starterAmount = totalFlour * STARTER_RATIO;

    // Verify total dough weight
    const calculatedTotal = totalFlour + totalWater + salt + starterAmount;
    console.assert(Math.round(calculatedTotal) === totalDough, 
        `Calculation error: ${calculatedTotal} vs ${totalDough}`);

    // Calculate starter feeding
    let feedingText;
    if(starterType === 'stiff') {
        const mature = Math.round(starterAmount / 8.5); // 1:5:2.5 ratio
        const flour = Math.round(mature * 5);
        const water = Math.round(mature * 2.5);
        feedingText = `Mix ${mature}g mature starter with ${flour}g flour and ${water}g water`;
    } else {
        const mature = Math.round(starterAmount / 9); // 1:4:4 ratio
        const flour = Math.round(mature * 4);
        const water = Math.round(mature * 4);
        feedingText = `Mix ${mature}g mature starter with ${flour}g flour and ${water}g water`;
    }

    // Temperature calculations
    const tempC = isCelsius ? tempInput : convertToCelsius(tempInput);
    const displayTemp = tempInput;
    const tempUnit = isCelsius ? 'C' : 'F';
    const bulkMinutes = calculateBulkTime(tempC);
    const feedingMinutes = calculateFeedingTime(tempC);
    const proofMinutes = Math.round(bulkMinutes * 0.5);

    // Additional ingredients
    const extras = breadRecipes[breadType].extraIngredients.map(ingredient => ({
        name: ingredient.name,
        weight: Math.round(totalFlour * (ingredient.percentage / 100)),
        percentage: ingredient.percentage
    }));

    // Build results HTML
    const resultsHTML = `
        <div class="schedule-step">
            <h3 class="step-title">Starter Preparation</h3>
            <p>${feedingText}</p>
            <p>Ferment for <span class="temp-badge">${formatDuration(feedingMinutes)}</span> at <span class="temp-badge">${displayTemp}°${tempUnit}</span></p>
        </div>

        <div class="schedule-step">
            <h3 class="step-title">Ingredients</h3>
            <ul class="ingredient-list">
                <li class="ingredient-item">
                    <span>Main flour: ${Math.round(totalFlour)}g</span>
                    <span class="ingredient-percentage">100%</span>
                </li>
                ${extras.map(extra => `
                    <li class="ingredient-item">
                        <span>${extra.name}: ${extra.weight}g</span>
                        <span class="ingredient-percentage">${extra.percentage}%</span>
                    </li>
                `).join('')}
                <li class="ingredient-item">
                    <span>Water: ${Math.round(totalWater)}g</span>
                    <span class="ingredient-percentage">${hydration}%</span>
                </li>
                <li class="ingredient-item">
                    <span>Salt: ${Math.round(salt)}g</span>
                    <span class="ingredient-percentage">2%</span>
                </li>
                <li class="ingredient-item">
                    <span>Starter: ${Math.round(starterAmount)}g (${starterType})</span>
                    <span class="ingredient-percentage">20%</span>
                </li>
            </ul>
        </div>

        ${breadRecipes[breadType].instructions.length > 0 ? `
        <div class="schedule-step">
            <h3 class="step-title">Special Instructions for ${document.getElementById('breadType').options[document.getElementById('breadType').selectedIndex].text}</h3>
            <ul class="ingredient-list">
                ${breadRecipes[breadType].instructions.map(instruction => `
                    <li class="ingredient-item special-instruction">${instruction}</li>
                `).join('')}
            </ul>
        </div>` : ''}

        <!-- Remaining schedule steps same as previous -->
    `;

    document.getElementById('results').innerHTML = resultsHTML;
}
