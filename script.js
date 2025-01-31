function generateRecipe() {
    // Get inputs
    const loaves = parseFloat(document.getElementById("loaves").value) || 1;
    const doughPerLoaf = parseFloat(document.getElementById("doughWeight").value) || 800;
    const hydration = parseFloat(document.getElementById("hydration").value) / 100 || 0.7;
    const starterHydration = parseFloat(document.getElementById("starterHydration").value) / 100 || 1;
    const temperature = parseFloat(document.getElementById("temperature").value) || 22;

    // Constants
    const SALT_PERCENT = 0.02; 
    const STARTER_PERCENT = 0.2;

    // Calculations
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
    const now = new Date();
    const steps = [];

    // Starter Feeding (12h before)
    const starterFeedTime = new Date(now.getTime() - 12 * 60 * 60 * 1000);
    steps.push(`
        <div class="step">
            <strong>Feed Starter</strong><br>
            ${formatTime(starterFeedTime)}: Mix ${starterFlour.toFixed(1)}g flour + ${starterWater.toFixed(1)}g water
        </div>
    `);

    // Autolyse (Now + 1h)
    const autolyseEnd = new Date(now.getTime() + 60 * 60 * 1000);
    steps.push(`
        <div class="step">
            <strong>Autolyse</strong><br>
            ${formatTime(now)} - ${formatTime(autolyseEnd)}: Mix flour + water (no starter/salt)
        </div>
    `);

    // Bulk Fermentation
    const bulkHours = calculateBulkTime(temperature);
    const bulkEnd = new Date(autolyseEnd.getTime() + bulkHours * 60 * 60 * 1000);
    steps.push(`
        <div class="step">
            <strong>Bulk Fermentation</strong><br>
            ${formatTime(autolyseEnd)} - ${formatTime(bulkEnd)} (${bulkHours} hours): Add starter + salt. Fold every 30min.
        </div>
    `);

    // Shaping & Proofing
    const shapingEnd = new Date(bulkEnd.getTime() + 0.5 * 60 * 60 * 1000);
    steps.push(`
        <div class="step">
            <strong>Shaping & Proofing</strong><br>
            ${formatTime(bulkEnd)} - ${formatTime(shapingEnd)}: Shape dough and proof in banneton.
        </div>
    `);

    // Baking
    const bakeEnd = new Date(shapingEnd.getTime() + 1 * 60 * 60 * 1000);
    steps.push(`
        <div class="step">
            <strong>Baking</strong><br>
            ${formatTime(shapingEnd)} - ${formatTime(bakeEnd)}: Bake at 250°C (lid-on 20min, lid-off 20min).
        </div>
    `);

    // Display Workflow
    document.getElementById("workflow").innerHTML = `
        <h3>⏰ Schedule (Current Time: ${formatTime(now)})</h3>
        ${steps.join('')}
    `;
}

// Helper: Format time to HH:MM AM/PM
function formatTime(date) {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

// Helper: Adjust bulk time by temperature
function calculateBulkTime(temp) {
    if (temp >= 25) return 4;
    if (temp >= 22) return 5;
    if (temp >= 19) return 6;
    return 7;
}

// Update hydration % display
document.getElementById("hydration").addEventListener("input", function() {
    document.getElementById("hydrationValue").textContent = `${this.value}%`;
});
