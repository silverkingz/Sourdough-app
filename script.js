function generateRecipe() {
    // Trigger Google Ad
    (adsbygoogle = window.adsbygoogle || []).push({});

    // Get inputs
    const loaves = parseFloat(document.getElementById("loaves").value);
    const doughPerLoaf = parseFloat(document.getElementById("doughWeight").value);
    const hydration = parseFloat(document.getElementById("hydration").value) / 100; // 70% → 0.7
    const starterHydration = parseFloat(document.getElementById("starterHydration").value) / 100; // 50% → 0.5
    const temperature = parseFloat(document.getElementById("temperature").value);

    // Constants
    const SALT_PERCENT = 0.02; // 2% salt
    const STARTER_PERCENT = 0.2; // 20% starter

    // Calculations
    const totalDough = doughPerLoaf * loaves;
    const totalFlour = totalDough / (1 + hydration + STARTER_PERCENT);
    const totalWater = totalFlour * hydration;
    const starterAmount = totalFlour * STARTER_PERCENT;
    
    // Starter composition
    const starterFlour = starterAmount / (1 + starterHydration);
    const starterWater = starterAmount - starterFlour;

    // Final dough components
    const finalFlour = totalFlour - starterFlour;
    const finalWater = totalWater - starterWater;
    const salt = totalFlour * SALT_PERCENT;

    // Baker's percentages
    const bakersPercent = {
        hydration: (totalWater / totalFlour * 100).toFixed(1),
        salt: (SALT_PERCENT * 100).toFixed(1),
        starter: (STARTER_PERCENT * 100).toFixed(1)
    };

    // Generate Results
    const resultsHTML = `
        <h3>Recipe for ${loaves} Loaf${loaves > 1 ? 's' : ''}</h3>
        <p>Total Dough: <strong>${totalDough.toFixed(1)}g</strong></p>
        <p>Final Flour: ${finalFlour.toFixed(1)}g</p>
        <p>Final Water: ${finalWater.toFixed(1)}g</p>
        <p>Starter: ${starterFlour.toFixed(1)}g flour + ${starterWater.toFixed(1)}g water</p>
        <p>Salt: ${salt.toFixed(1)}g</p>
        <p>Hydration: ${bakersPercent.hydration}% | Starter: ${bakersPercent.starter}%</p>
    `;

    // Generate Workflow Schedule
    const now = new Date();
    const steps = [];
    
    // Starter Feeding (12 hours before autolyse)
    const starterFeedTime = new Date(now.getTime() - 12 * 60 * 60 * 1000);
    steps.push({
        name: "Feed Starter",
        time: formatTime(starterFeedTime),
        action: `Mix ${starterFlour.toFixed(1)}g flour + ${starterWater.toFixed(1)}g water`
    });

    // Autolyse (Now)
    const autolyseEnd = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour
    steps.push({
        name: "Autolyse",
        time: `${formatTime(now)} - ${formatTime(autolyseEnd)}`,
        action: "Mix flour + water (no salt/starter)"
    });

    // Bulk Fermentation (temperature-adjusted)
    const bulkHours = calculateBulkTime(temperature);
    const bulkEnd = new Date(autolyseEnd.getTime() + bulkHours * 60 * 60 * 1000);
    steps.push({
        name: "Bulk Fermentation",
        time: `${formatTime(autolyseEnd)} - ${formatTime(bulkEnd)}`,
        action: `Add starter + salt. Stretch & fold every 30min (≈${bulkHours}hrs)`
    });

    // Shaping & Final Proof
    const shapingEnd = new Date(bulkEnd.getTime() + 0.5 * 60 * 60 * 1000); // 30min
    steps.push({
        name: "Shaping & Proofing",
        time: `${formatTime(bulkEnd)} - ${formatTime(shapingEnd)}`,
        action: "Shape dough and proof in banneton"
    });

    // Baking
    const bakeEnd = new Date(shapingEnd.getTime() + 1 * 60 * 60 * 1000); // 1 hour
    steps.push({
        name: "Baking",
        time: `${formatTime(shapingEnd)} - ${formatTime(bakeEnd)}`,
        action: "Preheat Dutch oven to 250°C. Bake 20min lid-on, 20min lid-off"
    });

    // Build Workflow HTML
    let workflowHTML = `<h3>⏰ Schedule (Current Time: ${formatTime(now)})</h3>`;
    steps.forEach(step => {
        workflowHTML += `
            <div class="step">
                <strong>${step.name}:</strong><br>
                <em>${step.time}</em><br>
                ${step.action}
            </div>
        `;
    });

    // Display Results
    document.getElementById("results").innerHTML = resultsHTML;
    document.getElementById("workflow").innerHTML = workflowHTML;
}

// Helper Functions
function formatTime(date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function calculateBulkTime(temp) {
    // Adjust bulk fermentation time based on temperature
    if (temp > 25) return 4;
    if (temp > 22) return 5;
    if (temp > 19) return 6;
    return 7;
}

// Hydration Slider Update
document.getElementById("hydration").addEventListener("input", function() {
    document.getElementById("hydrationValue").textContent = `${this.value}%`;
});
