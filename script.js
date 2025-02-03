const breadRecipes = {
    white: {
        extraIngredients: [],
        method: [
            "Feed starter 8-12 hours before mixing",
            "Mix flour and water (autolyse 1 hour)",
            "Add salt and starter, mix thoroughly",
            "Bulk ferment 4-6 hours with stretch & folds",
            "Shape and proof 1-2 hours",
            "Bake at 230°C (450°F) for 30 mins covered, 20 mins uncovered"
        ]
    },
    oat: {
        extraIngredients: [
            { name: "Rolled oats", percentage: 15 },
            { name: "Honey", percentage: 5 },
            { name: "Oat flour", percentage: 10 }
        ],
        method: [
            "Toast oats at 180°C for 5 minutes",
            "Mix oats with warm water (soak 30 mins)",
            "Add honey during autolyse",
            "Bulk ferment 5-7 hours",
            "Shape with oat flour coating",
            "Bake at 220°C (425°F) 35 mins covered"
        ]
    },
    multigrain: {
        extraIngredients: [
            { name: "Mixed seeds", percentage: 10 },
            { name: "Whole wheat flour", percentage: 20 }
        ],
        method: [
            "Soak seeds overnight",
            "Mix with whole wheat flour",
            "Extended autolyse 90 mins",
            "Bulk ferment 6-8 hours",
            "Bake at 225°C (435°F) 40 mins"
        ]
    },
    cheddar: {
        extraIngredients: [
            { name: "Cheddar cheese", percentage: 20 },
            { name: "Jalapeños", percentage: 5 }
        ],
        method: [
            "Cube cheese into 1cm pieces",
            "Mix in cheese and jalapeños during folding",
            "Cold proof overnight after shaping",
            "Bake at 240°C (465°F) 30 mins covered"
        ]
    }
};

let isCelsius = true;

function calculateRecipe() {
    const loaves = parseInt(document.getElementById('loaves').value) || 1;
    const doughWeight = parseInt(document.getElementById('doughWeight').value) || 800;
    const hydration = parseInt(document.getElementById('hydration').value);
    const temp = parseFloat(document.getElementById('temperature').value);
    const breadType = document.getElementById('breadType').value;
    const starterType = document.getElementById('starterType').value;

    // Baker's math calculations
    const totalDough = doughWeight * loaves;
    const saltPercentage = 0.02;
    const starterPercentage = 0.2;
    
    const totalFlour = totalDough / (1 + (hydration/100) + saltPercentage + starterPercentage);
    const water = totalFlour * (hydration/100);
    const salt = totalFlour * saltPercentage;
    const starter = totalFlour * starterPercentage;

    // Starter feeding calculation
    const starterFlour = starterType === 'stiff' ? starter * 0.666 : starter * 0.5;
    const starterWater = starterType === 'stiff' ? starter * 0.333 : starter * 0.5;

    // Temperature calculations
    const bulkTime = calculateBulkTime(temp);
    const proofTime = Math.round(bulkTime * 0.75);

    // Build results
    const resultsHTML = `
        <h3>Ingredients</h3>
        <ul class="ingredient-list">
            <li class="ingredient-item">
                <span>Total Flour:</span>
                <span>${Math.round(totalFlour)}g</span>
            </li>
            <li class="ingredient-item">
                <span>Water:</span>
                <span>${Math.round(water)}g</span>
            </li>
            ${breadRecipes[breadType].extraIngredients.map(ing => `
                <li class="ingredient-item">
                    <span>${ing.name}:</span>
                    <span>${Math.round(totalFlour * (ing.percentage/100))}g</span>
                </li>
            `).join('')}
            <li class="ingredient-item">
                <span>Salt:</span>
                <span>${Math.round(salt)}g</span>
            </li>
            <li class="ingredient-item">
                <span>Starter (${starterType}):</span>
                <span>${Math.round(starter)}g</span>
            </li>
        </ul>

        <h3>Method</h3>
        ${breadRecipes[breadType].method.map((step, index) => `
            <div class="method-step">
                <strong>Step ${index + 1}:</strong> ${step}
            </div>
        `).join('')}

        <div class="method-step">
            <strong>Timings:</strong><br>
            • Bulk Fermentation: ${Math.floor(bulkTime/60)}h ${bulkTime%60}m<br>
            • Final Proof: ${Math.floor(proofTime/60)}h ${proofTime%60}m<br>
            • Environment: ${temp}°${isCelsius ? 'C' : 'F'}
        </div>
    `;

    document.getElementById('results').innerHTML = resultsHTML;
}

function calculateBulkTime(temp) {
    const baseTemp = 24; // Ideal temperature
    const timeAtBase = 300; // 5 hours in minutes
    const tempDifference = baseTemp - (isCelsius ? temp : (temp - 32) * 5/9);
    return Math.round(timeAtBase * Math.pow(1.8, tempDifference/5));
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
    calculateRecipe();
}

// Event listeners
document.getElementById('hydration').addEventListener('input', function(e) {
    document.getElementById('hydrationValue').textContent = e.target.value;
});

// Initialize
calculateRecipe();
