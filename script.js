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

function calculateBulkTime(temp) {
    // Q10 temperature coefficient for fermentation (2.5 typical for yeast)
    const baseTemp = 24;
    const baseTime = 240; // 4 hours at 24°C
    return Math.round(baseTime * Math.pow(2.5, (baseTemp - temp)/10));
}

function calculateFeedingTime(temp) {
    // Base feeding time: 12 hours at 22°C for 1:4:4 feeding
    const baseTemp = 22;
    const baseTime = 720; // 12 hours in minutes
    const adjustedTime = baseTime * Math.pow(2.5, (baseTemp - temp)/10);
    return Math.max(360, Math.round(adjustedTime)); // Never less than 6 hours
}

function formatDuration(minutes) {
    const hours = Math.floor(minutes/60);
    const mins = minutes % 60;
    return `${hours}h${mins.toString().padStart(2, '0')}`;
}

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

    // Timing calculations
    const bulkMinutes = calculateBulkTime(temperature);
    const feedingMinutes = calculateFeedingTime(temperature);
    const proofMinutes = Math.round(bulkMinutes * 0.5);

    // Generate Results
    const resultsHTML = `
        <div class="schedule-step">
            <h3 class="step-title">Starter Feeding</h3>
            <p>${starterType === 'stiff' ? 
                'Mix 100g mature starter with 500g flour and 250g water (1:5:2.5 ratio)' : 
                'Mix 100g mature starter with 400g flour and 400g water (1:4:4 ratio)'}</p>
            <p>Fermentation time: <span class="temp-badge">${formatDuration(feedingMinutes)}</span> at <span class="temp-badge">${temperature}°${isCelsius ? 'C' : 'F'}</span></p>
            <p>Look for 50-70% rise and bubbly surface</p>
        </div>

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
            <h3 class="step-title">Bulk Fermentation</h3>
            <p>Total time: <span class="temp-badge">${formatDuration(bulkMinutes)}</span> at <span class="temp-badge">${temperature}°${isCelsius ? 'C' : 'F'}</span></p>
            <p>1. Mix ingredients and autolyse (30 minutes)</p>
            <p>2. Perform 4 sets of stretch and folds (every 30 minutes)</p>
            <p>3. Rest until ${Math.round(70 + (temperature/24 * 30))}% volume increase</p>
        </div>

        <div class="schedule-step">
            <h3 class="step-title">Shaping & Proofing</h3>
            <p>1. Divide into ${loaves} pieces (${doughWeight}g each)</p>
            <p>2. Pre-shape into loose rounds (rest 20 minutes)</p>
            <p>3. Final shape into tight batards/boules</p>
            <div class="proof-options">
                <p><strong>Proofing Options:</strong></p>
                <p>• Room temp (${temperature}°${isCelsius ? 'C' : 'F'}): ${formatDuration(proofMinutes)}</p>
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
