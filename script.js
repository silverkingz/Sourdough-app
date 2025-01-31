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
    // Get input values
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
        <div class="schedule-section">
            <h2 class="schedule-title">Baking Schedule</h2>
            
            <div class="process-step">
                <h3 class="step-header">Ingredients</h3>
                <ul class="ingredient-list">
                    <li class="ingredient-item">Main flour: ${Math.round(mainFlour)}g</li>
                    <li class="ingredient-item">Water: ${Math.round(mainWater)}g</li>
                    <li class="ingredient-item">Salt: ${Math.round(salt)}g</li>
                    <li class="ingredient-item">Starter: ${Math.round(starterAmount)}g (${starterType})</li>
                </ul>
            </div>

            <div class="process-step">
                <h3 class="step-header">1. Mixing & Bulk Fermentation</h3>
                <p>➤ Mix ${Math.round(mainFlour)}g flour + ${Math.round(mainWater)}g water</p>
                <p>➤ Rest 30 minutes, then add starter and salt</p>
                <p>➤ Perform 4 sets of stretch and folds every 30 minutes</p>
                <p>➤ Bulk ferment for 4-5 hours at <span class="temperature-badge">${temperature}°${isCelsius ? 'C' : 'F'}</span></p>
            </div>

            <div class="process-step">
                <h3 class="step-header">2. Shape and Proof</h3>
                <p>➤ Divide into ${loaves} pieces (${doughWeight}g each)</p>
                <p>➤ Pre-shape into loose balls, rest 20 minutes</p>
                <p>➤ Final shape into tight batards/boules</p>
                <div class="proof-notes">
                    <p><strong>Proofing Options:</strong></p>
                    <p>• Room temp: 1-2 hours until springy</p>
                    <p>• Cold proof: 12-16 hours in refrigerator</p>
                </div>
            </div>

            <div class="process-step">
                <h3 class="step-header">3. Baking</h3>
                <p>➤ Preheat Dutch oven to <span class="temperature-badge">250°C/480°F</span></p>
                <p>➤ Bake covered: 20 minutes</p>
                <p>➤ Uncover and bake: 20-25 minutes at <span class="temperature-badge">230°C/450°F</span></p>
                <p>➤ Cool on wire rack for 2+ hours</p>
            </div>
        </div>
    `;

    document.getElementById('resultsSection').innerHTML = resultsHTML;
}
