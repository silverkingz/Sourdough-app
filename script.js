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
    document.getElementById('hydrationValue').textContent = `${e.target.value}%`;
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

    // Timing calculations
    const baseTemp = 20;
    const tempFactor = baseTemp / temperature;
    const bulkTime = Math.round(4 * 60 * tempFactor);
    const proofTime = Math.round(2 * 60 * tempFactor);

    // Generate Results
    const ingredientsHTML = `
        <h2>Ingredients</h2>
        <div class="schedule-step">
            <p>Main Flour: <strong>${Math.round(mainFlour)}g</strong></p>
            <p>Water: <strong>${Math.round(mainWater)}g</strong></p>
            <p>Salt: <strong>${Math.round(salt)}g</strong></p>
            <p>Starter: <strong>${Math.round(starterAmount)}g</strong> (${starterType})</p>
        </div>
    `;

    const scheduleHTML = `
        <h2>Baking Schedule</h2>
        <div class="schedule-step">
            <h3>Starter Feeding (12 hours before)</h3>
            <p>${starterType === 'stiff' ? 
                '100g mature starter + 500g flour + 250g water' : 
                '100g mature starter + 400g flour + 400g water'}</p>
            <span class="temperature-badge">${temperature}°${isCelsius ? 'C' : 'F'}</span>
        </div>

        <div class="schedule-step">
            <h3>Day 1: Preparation</h3>
            <p>8:30 AM: Autolyse (mix flour & water)</p>
            <p>9:30 AM: Add starter and salt</p>
            <p>9:30 AM - 1:30 PM: Bulk fermentation (${bulkTime} minutes)</p>
            <p>→ Perform 4 stretch & fold sets every 30 minutes</p>
        </div>

        <div class="schedule-step">
            <h3>Day 2: Baking</h3>
            <p>1:30 PM: Divide into ${loaves} loaves</p>
            <p>2:00 PM: Final proof (${proofTime} minutes)</p>
            <p>6:00 PM: Bake at 250°C/480°F</p>
            <p>→ 20 mins covered + 25-30 mins uncovered</p>
        </div>
    `;

    document.getElementById('results').innerHTML = ingredientsHTML;
    document.getElementById('schedule').innerHTML = scheduleHTML;
}
