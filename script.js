const breadRecipes = {
    white: {
        extraIngredients: [],
        instructions: [],
        method: [
            {
                title: "Starter Preparation",
                steps: [
                    "8-12 hours before mixing: Feed starter using 1:5:2.5 ratio (starter:flour:water)",
                    "Maintain at 22-24°C for optimal activity",
                    "Starter should peak 1 hour before mixing"
                ]
            },
            {
                title: "Autolyse Phase",
                steps: [
                    "Mix ${mainFlour}g flour with ${autolyseWater}g water (${hydration}% hydration)",
                    "Rest for 45-60 minutes at ${temperature}°C",
                    "Develop gluten structure before adding salt"
                ]
            },
            {
                title: "Mixing & Bulk Fermentation",
                steps: [
                    "Add ${salt}g salt and ${starterAmount}g starter to autolysed dough",
                    "Mix until full gluten development (windowpane test)",
                    "Bulk ferment for ${bulkTime} at ${temperature}°C",
                    "Perform stretch & folds every 30 minutes for first 2 hours"
                ]
            },
            {
                title: "Shaping & Final Proof",
                steps: [
                    "Preshape dough and rest 15 minutes",
                    "Final shape and place in banneton",
                    "Proof at ${temperature}°C for ${proofTime}",
                    "Check readiness using poke test"
                ]
            },
            {
                title: "Baking",
                steps: [
                    "Preheat Dutch oven to 250°C for 45 minutes",
                    "Bake covered for 20 minutes",
                    "Reduce heat to 230°C and bake uncovered for 25 minutes",
                    "Cool on wire rack for 2+ hours"
                ]
            }
        ]
    },
    oat: {
        extraIngredients: [
            { name: "Rolled oats", percentage: 15 },
            { name: "Honey", percentage: 5 },
            { name: "Oat flour", percentage: 10 }
        ],
        instructions: [
            "Toast oats at 180°C for 5 minutes before mixing",
            "Add honey during autolyse",
            "Use oat flour for dusting"
        ],
        method: [
            {
                title: "Oat Preparation",
                steps: [
                    "Toast ${oatWeight}g oats at 180°C for 8 minutes",
                    "Soak toasted oats in 50g warm water for 30 minutes",
                    "Mix honey with reserved water for autolyse"
                ]
            },
            {
                title: "Enhanced Autolyse",
                steps: [
                    "Combine ${mainFlour}g flour, ${oatFlour}g oat flour, and ${autolyseWater}g water",
                    "Add honey mixture and soaked oats",
                    "Rest 60 minutes at ${temperature}°C"
                ]
            }
        ]
    },
    multigrain: {
        extraIngredients: [
            { name: "Mixed seeds", percentage: 10 },
            { name: "Whole wheat flour", percentage: 20 },
            { name: "Malted grains", percentage: 5 }
        ],
        method: [
            {
                title: "Seed Preparation",
                steps: [
                    "Soak ${seedWeight}g mixed seeds in 100g warm water for 1 hour",
                    "Drain and reserve soaking water for autolyse"
                ]
            }
        ]
    },
    cheddar: {
        extraIngredients: [
            { name: "Cheddar cheese", percentage: 20 },
            { name: "Jalapeños", percentage: 5 },
            { name: "Smoked paprika", percentage: 1 }
        ],
        method: [
            {
                title: "Cheese Preparation",
                steps: [
                    "Cube ${cheeseWeight}g cheddar into 1cm pieces",
                    "Pat dry with paper towels to remove excess oil",
                    "Toss cheese with ${paprikaWeight}g smoked paprika"
                ]
            }
        ]
    }
};

let isCelsius = true;

// Core Baker's Math Calculations
function calculateIngredients(totalDough, hydration, starterType) {
    const SALT_PERCENTAGE = 0.02;
    const STARTER_RATIO = 0.2;
    
    const totalFlour = totalDough / (1 + (hydration/100) + SALT_PERCENTAGE + STARTER_RATIO);
    const totalWater = (totalFlour * (hydration/100)).toFixed(1);
    const salt = (totalFlour * SALT_PERCENTAGE).toFixed(1);
    const starterAmount = (totalFlour * STARTER_RATIO).toFixed(1);
    
    return { 
        totalFlour: parseFloat(totalFlour),
        totalWater: parseFloat(totalWater),
        salt: parseFloat(salt),
        starterAmount: parseFloat(starterAmount)
    };
}

function generateRecipe() {
    // Input Values
    const breadType = document.getElementById('breadType').value;
    const loaves = parseInt(document.getElementById('loaves').value) || 1;
    const doughWeight = parseInt(document.getElementById('doughWeight').value) || 800;
    const hydration = parseInt(document.getElementById('hydration').value) || 70;
    const temp = parseFloat(document.getElementById('temperature').value) || 22;
    const starterType = document.getElementById('starterType').value;

    // Calculations
    const totalDough = doughWeight * loaves;
    const ingredients = calculateIngredients(totalDough, hydration, starterType);
    const autolyseWater = ingredients.totalWater * 0.9;
    const mixWater = ingredients.totalWater * 0.1;

    // Timing Calculations
    const bulkTime = calculateBulkTime(temp);
    const proofTime = calculateProofTime(temp);
    const feedingTime = calculateFeedingTime(temp);

    // Generate Method Steps
    const methodHTML = breadRecipes[breadType].method.map(section => `
        <div class="method-step">
            <h3>${section.title}</h3>
            ${section.steps.map(step => `
                <p>${replacePlaceholders(step, {
                    ...ingredients,
                    autolyseWater: Math.round(autolyseWater),
                    mixWater: Math.round(mixWater),
                    hydration: hydration,
                    temperature: isCelsius ? temp : convertToCelsius(temp),
                    bulkTime: formatDuration(bulkTime),
                    proofTime: formatDuration(proofTime),
                    feedingTime: formatDuration(feedingTime),
                    oatWeight: Math.round(ingredients.totalFlour * 0.15),
                    seedWeight: Math.round(ingredients.totalFlour * 0.10),
                    cheeseWeight: Math.round(ingredients.totalFlour * 0.20),
                    paprikaWeight: Math.round(ingredients.totalFlour * 0.01)
                })}</p>
            `).join('')}
        </div>
    `).join('');

    // Display Results
    document.getElementById('results').innerHTML = `
        <div class="ingredient-grid">
            <div class="ingredient-card">
                <h3>📝 Ingredients</h3>
                <p>Main Flour: ${Math.round(ingredients.totalFlour)}g</p>
                <p>Water: ${Math.round(ingredients.totalWater)}g</p>
                <p>Salt: ${Math.round(ingredients.salt)}g</p>
                <p>Starter: ${Math.round(ingredients.starterAmount)}g</p>
                ${breadRecipes[breadType].extraIngredients.map(ing => `
                    <p>${ing.name}: ${Math.round(ingredients.totalFlour * (ing.percentage/100))}g</p>
                `).join('')}
            </div>
            <div class="timing-card">
                <h3>⏰ Schedule</h3>
                <p class="timing-badge">Bulk Fermentation: ${formatDuration(bulkTime)}</p>
                <p class="timing-badge">Final Proof: ${formatDuration(proofTime)}</p>
                <p class="timing-badge">Starter Feeding: ${formatDuration(feedingTime)}</p>
            </div>
        </div>
        
        <h2>📖 Baking Method</h2>
        ${methodHTML}
        
        <div class="special-note">
            Note: Times based on ${temp}°${isCelsius ? 'C' : 'F'} environment temperature.
            Adjust fermentation times if temperature changes significantly.
        </div>
    `;
}

// Helper Functions
function replacePlaceholders(text, values) {
    return Object.entries(values).reduce((str, [key, value]) => 
        str.replace(new RegExp(`\\\${${key}}`, 'g'), Math.round(value)), text);
}

function calculateBulkTime(temp) {
    const baseTemp = 24;
    return Math.round(240 * Math.pow(2.5, (baseTemp - temp)/10));
}

function calculateProofTime(temp) {
    return Math.round(calculateBulkTime(temp) * 0.6);
}

function calculateFeedingTime(temp) {
    return Math.max(360, Math.round(720 * Math.pow(2.5, (22 - temp)/10)));
}

function formatDuration(minutes) {
    const hours = Math.floor(minutes/60);
    const mins = minutes % 60;
    return `${hours}h${mins.toString().padStart(2, '0')}m`;
}

// Temperature Conversion
function toggleUnit() {
    const tempInput = document.getElementById('temperature');
    const currentTemp = parseFloat(tempInput.value);
    
    tempInput.value = isCelsius ? 
        Math.round(currentTemp * 9/5 + 32) : 
        Math.round((currentTemp - 32) * 5/9);
    
    isCelsius = !isCelsius;
    if(document.getElementById('results').innerHTML) generateRecipe();
}

// Event Listeners
document.getElementById('hydration').addEventListener('input', function(e) {
    document.getElementById('hydrationValue').textContent = e.target.value;
});

// Initialization
document.addEventListener('DOMContentLoaded', function() {
    generateRecipe();
});
