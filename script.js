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
    
    // Regenerate recipe if results exist
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

function calculateExtras(totalFlour, breadType) {
    return breadRecipes[breadType].extraIngredients.map(ingredient => ({
        name: ingredient.name,
        weight: Math.round(totalFlour * (ingredient.percentage / 100))
    }));
}

function generateRecipe() {
    const breadType = document.getElementById('breadType').value;
    const loaves = parseInt(document.getElementById('loaves').value);
    const doughWeight = parseInt(document.getElementById('doughWeight').value);
    const hydration = parseInt(document.getElementById('hydration').value);
    const tempInput = parseFloat(document.getElementById('temperature').value);
    const starterType = document.getElementById('starterType').value;

    // Convert temperature to Celsius for calculations
    const tempC = isCelsius ? tempInput : convertToCelsius(tempInput);
    const displayTemp = tempInput;
    const tempUnit = isCelsius ? 'C' : 'F';

    const totalDough = doughWeight * loaves;
    const starterHydration = starterType === 'stiff' ? 0.5 : 1.0;
    const starterRatio = 0.2;
    
    const totalFlour = totalDough / (1 + hydration/100 + starterRatio);
    const totalWater = totalFlour * (hydration/100);
    const starterAmount = totalFlour * starterRatio;
    
    const starterFlour = starterAmount / (1 + starterHydration);
    const starterWater = starterAmount - starterFlour;
    
    const mainFlour = totalFlour - starterFlour;
    const mainWater = totalWater - starterWater;
    const salt = totalFlour * 0.02;

    const bulkMinutes = calculateBulkTime(tempC);
    const feedingMinutes = calculateFeedingTime(tempC);
    const proofMinutes = Math.round(bulkMinutes * 0.5);
    const extras = calculateExtras(totalFlour, breadType);

    const resultsHTML = `
        <div class="schedule-step">
            <h3 class="step-title">Starter Preparation</h3>
            <p>${starterType === 'stiff' ? 
                'Mix 100g mature starter with 500g flour and 250g water (1:5:2.5 ratio)' : 
                'Mix 100g mature starter with 400g flour and 400g water (1:4:4 ratio)'}</p>
            <p>Ferment for <span class="temp-badge">${formatDuration(feedingMinutes)}</span> at <span class="temp-badge">${displayTemp}°${tempUnit}</span></p>
        </div>

        <div class="schedule-step">
            <h3 class="step-title">Ingredients</h3>
            <ul class="ingredient-list">
                <li class="ingredient-item">Main flour: ${Math.round(mainFlour)}g</li>
                ${extras.map(extra => `
                    <li class="ingredient-item">${extra.name}: ${extra.weight}g</li>
                `).join('')}
                <li class="ingredient-item">Water: ${Math.round(mainWater)}g</li>
                <li class="ingredient-item">Salt: ${Math.round(salt)}g</li>
                <li class="ingredient-item">Starter: ${Math.round(starterAmount)}g (${starterType})</li>
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

        <div class="schedule-step">
            <h3 class="step-title">Bulk Fermentation</h3>
            <p>Total time: <span class="temp-badge">${formatDuration(bulkMinutes)}</span> at <span class="temp-badge">${displayTemp}°${tempUnit}</span></p>
            <ul class="ingredient-list">
                <li class="ingredient-item">Mix ingredients and autolyse (30 minutes)</li>
                <li class="ingredient-item">Perform 4 sets of stretch and folds (every 30 minutes)</li>
                <li class="ingredient-item">Rest until 50-70% volume increase</li>
            </ul>
        </div>

        <div class="schedule-step">
            <h3 class="step-title">Shaping & Proofing</h3>
            <ul class="ingredient-list">
                <li class="ingredient-item">Divide into ${loaves} pieces (${doughWeight}g each)</li>
                <li class="ingredient-item">Pre-shape into loose rounds (20 minute rest)</li>
                <li class="ingredient-item">Final shape into tight batards/boules</li>
            </ul>
            <div class="proof-options">
                <p><strong>Proofing Options:</strong></p>
                <p>• Room temp (${displayTemp}°${tempUnit}): ${formatDuration(proofMinutes)}</p>
                <p>• Cold proof: 12-16 hours refrigerated</p>
            </div>
        </div>

        <div class="schedule-step">
            <h3 class="step-title">Baking Instructions</h3>
            <ul class="ingredient-list">
                <li class="ingredient-item">Preheat Dutch oven to <span class="temp-badge">250°C/480°F</span></li>
                <li class="ingredient-item">Bake covered: 20 minutes</li>
                <li class="ingredient-item">Uncover and bake: 20-25 minutes at <span class="temp-badge">230°C/450°F</span></li>
                <li class="ingredient-item">Cool on wire rack for ≥2 hours</li>
            </ul>
        </div>

        <div class="disclaimer-note">
            <strong>Important Note:</strong> All timing and temperature recommendations are guidelines. 
            Actual results may vary depending on your starter activity, flour type, and environmental conditions. 
            Use visual cues (volume increase, bubble formation, dough texture) as your primary indicators.
        </div>
    `;

    document.getElementById('results').innerHTML = resultsHTML;
}
