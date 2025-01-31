let isCelsius = true;

function toggleUnit() {
    const tempInput = document.getElementById('temperature');
    const currentTemp = parseFloat(tempInput.value);
    
    if(isCelsius) {
        tempInput.value = Math.round(currentTemp * 9/5 + 32);
    } else {
        tempInput.value = Math.round((currentTemp - 32) * 5/9);
    }
    isCelsius = !isCelsius;
}

document.getElementById('hydration').addEventListener('input', (e) => {
    document.getElementById('hydrationValue').textContent = e.target.value;
});

function generateRecipe() {
    const loaves = parseInt(document.getElementById('loaves').value);
    const doughWeight = parseInt(document.getElementById('doughWeight').value);
    const hydration = parseInt(document.getElementById('hydration').value);
    const temperature = parseFloat(document.getElementById('temperature').value);
    const starterType = document.getElementById('starterType').value;

    // Calculations
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

    // Generate Results
    const resultsHTML = `
        <div class="schedule-step">
            <h3 class="step-title">Ingredients</h3>
            <ul class="ingredient-list">
                <li class="ingredient-item">Main flour: ${Math.round(mainFlour)}g</li>
                <li class="ingredient-item">Water: ${Math.round(mainWater)}g</li>
                <li class="ingredient-item">Salt: ${Math.round(salt)}g</li>
                <li class="ingredient-item">Starter: ${Math.round(starterAmount)}g (${starterType})</li>
            </ul>
        </div>

        <div class="schedule-step">
            <h3 class="step-title">Mixing & Bulk Fermentation</h3>
            <p>1. Mix ${Math.round(mainFlour)}g flour + ${Math.round(mainWater)}g water</p>
            <p>2. Rest 30 minutes (autolyse)</p>
            <p>3. Add starter and salt, mix thoroughly</p>
            <p>4. Bulk ferment at <span class="temp-badge">${temperature}°${isCelsius ? 'C' : 'F'}</span> for 4-5 hours</p>
            <p>→ Perform 4 sets of stretch and folds every 30 minutes</p>
        </div>

        <div class="schedule-step">
            <h3 class="step-title">Shaping & Proofing</h3>
            <p>1. Divide into ${loaves} pieces (${doughWeight}g each)</p>
            <p>2. Pre-shape into loose rounds, rest 20 minutes</p>
            <p>3. Final shape into tight batards/boules</p>
            <div class="proof-options">
                <p><strong>Proofing Options:</strong></p>
                <p>• Room temp: 1-2 hours until springy</p>
                <p>• Cold proof: 12-16 hours in refrigerator</p>
            </div>
        </div>

        <div class="schedule-step">
            <h3 class="step-title">Baking</h3>
            <p>1. Preheat Dutch oven to <span class="temp-badge">250°C/480°F</span></p>
            <p>2. Bake covered: 20 minutes</p>
            <p>3. Uncover and bake: 20-25 minutes at <span class="temp-badge">230°C/450°F</span></p>
            <p>4. Cool on wire rack for ≥2 hours</p>
        </div>
    `;

    document.getElementById('results').innerHTML = resultsHTML;
}
