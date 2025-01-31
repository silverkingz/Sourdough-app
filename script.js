let isCelsius = true;

// Unit Toggle
document.querySelectorAll('input[name="unit"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        isCelsius = e.target.value === 'C';
        const doughTempInput = document.getElementById('doughTempC');
        const currentTemp = parseFloat(doughTempInput.value);
        doughTempInput.value = isCelsius ? fahrenheitToCelsius(currentTemp) : celsiusToFahrenheit(currentTemp);
        document.getElementById('doughTempUnit').textContent = isCelsius ? '°C' : '°F';
    });
});

// Unit Converters
function celsiusToFahrenheit(c) { return (c * 9/5) + 32; }
function fahrenheitToCelsius(f) { return (f - 32) * 5/9; }

function generateRecipe() {
    // Get Inputs
    const loaves = parseFloat(document.getElementById("loaves").value) || 1;
    const doughPerLoaf = parseFloat(document.getElementById("doughWeight").value) || 800;
    const hydration = parseFloat(document.getElementById("hydration").value) / 100 || 0.7;
    const starterHydration = parseFloat(document.getElementById("starterHydration").value) / 100 || 1;
    const autolyseTime = document.getElementById("autolyseTime").value ? new Date(document.getElementById("autolyseTime").value) : new Date();
    let doughTemp = parseFloat(document.getElementById("doughTempC").value) || 22;
    doughTemp = isCelsius ? doughTemp : fahrenheitToCelsius(doughTemp); // Always use °C internally

    // Constants
    const SALT_PERCENT = 0.02;
    const STARTER_PERCENT = 0.2;

    // Recipe Calculations (same as before)
    const totalDough = doughPerLoaf * loaves;
    const totalFlour = totalDough / (1 + hydration + STARTER_PERCENT);
    const totalWater = totalFlour * hydration;
    const starterAmount = totalFlour * STARTER_PERCENT;
    const starterFlour = starterAmount / (1 + starterHydration);
    const starterWater = starterAmount - starterFlour;
    const finalFlour = totalFlour - starterFlour;
    const finalWater = totalWater - starterWater;
    const salt = totalFlour * SALT_PERCENT;

    // Display Recipe
    document.getElementById("results").innerHTML = `
        <h3>Recipe for ${loaves} Loaf${loaves > 1 ? 's' : ''}</h3>
        <p>Total Dough: <strong>${totalDough.toFixed(1)}g</strong></p>
        <p>Flour: ${finalFlour.toFixed(1)}g</p>
        <p>Water: ${finalWater.toFixed(1)}g</p>
        <p>Starter: ${starterFlour.toFixed(1)}g flour + ${starterWater.toFixed(1)}g water</p>
        <p>Salt: ${salt.toFixed(1)}g</p>
    `;

    // Generate Workflow
    const steps = [];
    const startTime = autolyseTime;

    // Starter Feeding (12-14h before autolyse)
    const starterFeedTime = new Date(startTime.getTime() - 13 * 60 * 60 * 1000); // 13h prior
    steps.push(`
        <div class="step">
            <strong>Feed Starter</strong><br>
            ${formatTime(starterFeedTime)}: Mix ${starterFlour.toFixed(1)}g flour + ${starterWater.toFixed(1)}g water<br>
            <em>(${starterHydration * 100}% hydration starter)</em>
        </div>
    `);

    // Autolyse
    const autolyseEnd = new Date(startTime.getTime() + 60 * 60 * 1000);
    steps.push(`
        <div class="step">
            <strong>Autolyse</strong><br>
            ${formatTime(startTime)} - ${formatTime(autolyseEnd)}: Mix flour + water
        </div>
    `);

    // Bulk Fermentation (temperature-adjusted)
    const bulkHours = calculateBulkTime(doughTemp);
    const bulkEnd = new Date(autolyseEnd.getTime() + bulkHours * 60 * 60 * 1000);
    steps.push(`
        <div class="step">
            <strong>Bulk Fermentation</strong><br>
            ${formatTime(autolyseEnd)} - ${formatTime(bulkEnd)} (${bulkHours}hrs)<br>
            <em>Dough Temp: ${isCelsius ? doughTemp.toFixed(1) + '°C' : celsiusToFahrenheit(doughTemp).toFixed(1) + '°F'}</em>
        </div>
    `);

    // Shaping & Final Proof
    const shapingEnd = new Date(bulkEnd.getTime() + 0.5 * 60 * 60 * 1000);
    steps.push(`
        <div class="step">
            <strong>Shaping & Final Proof</strong><br>
            ${formatTime(bulkEnd)} - ${formatTime(shapingEnd)}
        </div>
    `);

    // Baking
    const bakeTemp = isCelsius ? '250°C' : '480°F';
    const bakeEnd = new Date(shapingEnd.getTime() + 1 * 60 * 60 * 1000);
    steps.push(`
        <div class="step">
            <strong>Baking</strong><br>
            ${formatTime(shapingEnd)} - ${formatTime(bakeEnd)}: Preheat to ${bakeTemp}, bake 40min.
        </div>
    `);

    // Display Workflow
    document.getElementById("workflow").innerHTML = `
        <h3>⏰ Schedule</h3>
        ${steps.join('')}
    `;
}

// Helper Functions
function formatTime(date) {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

function calculateBulkTime(doughTempC) {
    if (doughTempC >= 25) return 4;
    if (doughTempC >= 22) return 5;
    if (doughTempC >= 19) return 6;
    return 7;
}

// Hydration Slider Update
document.getElementById("hydration").addEventListener("input", function() {
    document.getElementById("hydrationValue").textContent = `${this.value}%`;
});

// Initialize Autolyse Time to Now
document.getElementById("autolyseTime").value = new Date().toISOString().slice(0, 16);
