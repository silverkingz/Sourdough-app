const breadRecipes = {
    white: {
        extraIngredients: [],
        method: [
            {
                title: "Starter Preparation (12 Hours Before)",
                steps: [
                    "Mix ${starterFeed}g mature starter with ${starterFlour}g flour and ${starterWater}g water",
                    "Maintain at ${temperature}°${unit} for optimal activity",
                    "Starter should double in size before use"
                ]
            },
            {
                title: "Autolyse Phase",
                steps: [
                    "Combine ${flour}g flour with ${water}g water (${hydration}% hydration)",
                    "Mix until no dry flour remains",
                    "Rest for 1 hour at ${temperature}°${unit}"
                ]
            },
            {
                title: "Bulk Fermentation",
                steps: [
                    "Add ${salt}g salt and ${starter}g starter",
                    "Mix thoroughly for 5 minutes",
                    "Perform 4 sets of stretch & folds every 30 minutes",
                    "Total bulk time: ${bulkTime} at ${temperature}°${unit}"
                ]
            },
            {
                title: "Shaping & Final Proof",
                steps: [
                    "Preshape dough into tight round",
                    "Bench rest 15 minutes",
                    "Final shape and place in banneton",
                    "Proof for ${proofTime} at ${temperature}°${unit}"
                ]
            },
            {
                title: "Baking",
                steps: [
                    "Preheat Dutch oven to 250°C (480°F) for 45 minutes",
                    "Bake covered for 20 minutes",
                    "Remove lid and bake 25 minutes at 230°C (450°F)",
                    "Internal temperature should reach 96°C (205°F)"
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
        method: [
            {
                title: "Oat Preparation",
                steps: [
                    "Toast ${oatWeight}g oats at 180°C for 8 minutes",
                    "Soak oats in 50g warm water for 30 minutes",
                    "Mix honey with autolyse water"
                ]
            }
        ]
    },
    multigrain: {
        extraIngredients: [
            { name: "Mixed seeds", percentage: 10 },
            { name: "Whole wheat flour", percentage: 20 }
        ],
        method: [
            {
                title: "Seed Preparation",
                steps: [
                    "Soak ${seedWeight}g seeds in 100g warm water overnight",
                    "Drain and reserve soaking water"
                ]
            }
        ]
    },
    cheddar: {
        extraIngredients: [
            { name: "Cheddar cheese", percentage: 20 },
            { name: "Jalapeños", percentage: 5 }
        ],
        method: [
            {
                title: "Cheese Preparation",
                steps: [
                    "Cube ${cheeseWeight}g cheese into 1cm pieces",
                    "Pat dry with paper towels",
                    "Mix into dough during final folds"
                ]
            }
        ]
    }
};

let isCelsius = true;

function calculateRecipe() {
    const breadType = document.getElementById('breadType').value;
    const loaves = parseInt(document.getElementById('loaves').value) || 1;
    const doughWeight = parseInt(document.getElementById('doughWeight').value) || 800;
    const hydration = parseInt(document.getElementById('hydration').value);
    const temp = parseFloat(document.getElementById('temperature').value);
    const starterType = document.getElementById('starterType').value;

    // Baker's math calculations
    const totalDough = doughWeight * loaves;
    const saltPercentage = 0.02;
    const starterPercentage = 0.2;
    
    const totalFlour = totalDough / (1 + (hydration/100) + saltPercentage + starterPercentage);
    const totalWater = totalFlour * (hydration/100);
    const salt = totalFlour * saltPercentage;
    const starter = totalFlour * starterPercentage;

    // Starter feeding calculations
    let starterFeed, starterFlour, starterWater;
    if(starterType === 'stiff') {
        starterFeed = Math.round(starter / 8.5);
        starterFlour = starterFeed * 5;
        starterWater = starterFeed * 2.5;
    } else {
        starterFeed = Math.round(starter / 9);
        starterFlour = starterFeed * 4;
        starterWater = starterFeed * 4;
    }

    // Temperature calculations
    const tempC = isCelsius ? temp : (temp - 32) * 5/9;
    const bulkTime = calculateBulkTime(tempC);
    const proofTime = Math.round(bulkTime * 0.75);

    // Build results
    const resultsHTML = `
        <div class="ingredient-list">
            <h3>Ingredients for ${loaves} ${loaves > 1 ? 'loaves' : 'loaf'}</h3>
            ${[
                `Main Flour: ${Math.round(totalFlour)}g`,
                `Water: ${Math.round(totalWater)}g`,
                `Salt: ${Math.round(salt)}g`,
                `Starter: ${Math.round(starter)}g (${starterType})`,
                ...breadRecipes[breadType].extraIngredients.map(ing => 
                    `${ing.name}: ${Math.round(totalFlour * (ing.percentage/100))}g`
                )
            ].map(item => `
                <div class="ingredient-item">
                    <span>${item.split(':')[0]}:</span>
                    <span>${item.split(':')[1]}</span>
                </div>
            `).join('')}
        </div>

        <div class="method-section">
            <h3>Baking Method</h3>
            ${breadRecipes[breadType].method.map((section, index) => `
                <div class="method-step">
                    <h4>${section.title}</h4>
                    ${section.steps.map(step => `
                        <p>${replacePlaceholders(step, {
                            starterFeed: starterFeed,
                            starterFlour: starterFlour,
                            starterWater: starterWater,
                            flour: Math.round(totalFlour),
                            water: Math.round(totalWater),
                            salt: Math.round(salt),
                            starter: Math.round(starter),
                            temperature: temp.toFixed(1),
                            unit: isCelsius ? 'C' : 'F',
                            hydration: hydration,
                            bulkTime: formatTime(bulkTime),
                            proofTime: formatTime(proofTime),
                            oatWeight: Math.round(totalFlour * 0.15),
                            seedWeight: Math.round(totalFlour * 0.10),
                            cheeseWeight: Math.round(totalFlour * 0.20)
                        })}</p>
                    `).join('')}
                </div>
            `).join('')}
        </div>
    `;

    document.getElementById('results').innerHTML = resultsHTML;
}

function calculateBulkTime(temp) {
    const baseTemp = 24;
    const baseTime = 240; // 4 hours in minutes
    return Math.round(baseTime * Math.pow(2.5, (baseTemp - temp)/10));
}

function formatTime(minutes) {
    const hours = Math.floor(minutes/60);
    const mins = minutes % 60;
    return `${hours}h${mins.toString().padStart(2, '0')}m`;
}

function replacePlaceholders(text, values) {
    return text.replace(/\${(.*?)}/g, (_, key) => values[key] || key);
}

function toggleUnit() {
    const tempInput = document.getElementById('temperature');
    const currentTemp = parseFloat(tempInput.value);
    
    if(isCelsius) {
        tempInput.value = (currentTemp * 9/5 + 32).toFixed(1);
    } else {
        tempInput.value = ((currentTemp - 32) * 5/9).toFixed(1);
    }
    isCelsius = !isCelsius;
    calculateRecipe();
}

// Event listeners
document.getElementById('hydration').addEventListener('input', function(e) {
    document.getElementById('hydrationValue').textContent = e.target.value;
});

document.querySelectorAll('input, select').forEach(element => {
    element.addEventListener('change', calculateRecipe);
});

// Initial calculation
calculateRecipe();
