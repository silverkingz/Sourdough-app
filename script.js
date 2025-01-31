function generateRecipe() {
    // Clear previous results
    const resultsDiv = document.getElementById('results');
    const scheduleDiv = document.getElementById('schedule');
    resultsDiv.innerHTML = '';
    scheduleDiv.innerHTML = '';

    // Get input values
    const loaves = parseInt(document.getElementById('loaves').value) || 1;
    const doughPerLoaf = parseInt(document.getElementById('doughWeight').value) || 800;
    const hydration = parseInt(document.getElementById('hydration').value) / 100 || 0.7;
    const doughTemp = parseFloat(document.getElementById('temperature').value) || 22;
    const starterHydration = parseInt(document.getElementById('starterType').value) / 100 || 1;

    // Base recipe for 1 loaf (800g)
    const baseRecipe = {
        flour: 500,
        water: 350,
        salt: 10,
        starter: 100
    };

    // Calculate scaled ingredients
    const scaledRecipe = {
        flour: Math.round(baseRecipe.flour * (doughPerLoaf / 800) * loaves),
        salt: Math.round(baseRecipe.salt * (doughPerLoaf / 800) * loaves),
        starter: Math.round(baseRecipe.starter * (doughPerLoaf / 800) * loaves)
    };
    
    // Adjust water for hydration
    scaledRecipe.water = Math.round(scaledRecipe.flour * hydration);

    // Calculate bulk fermentation time
    const bulkHours = calculateBulkTime(doughTemp);

    // Generate schedule
    const now = new Date();
    const scheduleSteps = [];

    // Starter feeding (12 hours before)
    const starterFeedTime = new Date(now.getTime() - 12 * 60 * 60 * 1000);
    scheduleSteps.push(createScheduleStep(
        "Feed Starter",
        starterFeedTime,
        `Mix ${starterHydration === 0.5 ? '1:2:2' : '1:1:1'} ratio (${starterHydration * 100}% hydration)`
    ));

    // Autolyse
    const autolyseEnd = new Date(now.getTime() + 60 * 60 * 1000);
    scheduleSteps.push(createScheduleStep(
        "Autolyse",
        now,
        autolyseEnd,
        `Mix ${scaledRecipe.flour}g flour + ${scaledRecipe.water}g water`
    ));

    // Mix dough
    const mixEnd = new Date(autolyseEnd.getTime() + 15 * 60 * 1000);
    scheduleSteps.push(createScheduleStep(
        "Mix Dough",
        autolyseEnd,
        mixEnd,
        `Add ${scaledRecipe.starter}g starter + ${scaledRecipe.salt}g salt`
    ));

    // Bulk fermentation with folds
    const bulkEnd = new Date(mixEnd.getTime() + bulkHours * 60 * 60 * 1000);
    scheduleSteps.push(createScheduleStep(
        "Bulk Fermentation",
        mixEnd,
        bulkEnd,
        `Perform 4 sets of stretch & folds (every 30 minutes)`
    ));

    // Shape and proof
    const shapeEnd = new Date(bulkEnd.getTime() + 30 * 60 * 1000);
    scheduleSteps.push(createScheduleStep(
        "Shape & Proof",
        bulkEnd,
        shapeEnd,
        "Pre-shape, rest 30min, final shape"
    ));

    // Cold proof
    const coldProofEnd = new Date(shapeEnd.getTime() + 12 * 60 * 60 * 1000);
    scheduleSteps.push(createScheduleStep(
        "Cold Proof",
        shapeEnd,
        coldProofEnd,
        "Refrigerate at 4°C"
    ));

    // Bake
    const bakeEnd = new Date(coldProofEnd.getTime() + 60 * 60 * 1000);
    scheduleSteps.push(createScheduleStep(
        "Bake",
        coldProofEnd,
        bakeEnd,
        "250°C with steam for 20min, 230°C for 20min"
    ));

    // Display results
    displayResults(scaledRecipe, scheduleSteps);
}

function calculateBulkTime(tempC) {
    if (tempC >= 25) return 4;
    if (tempC >= 22) return 5;
    if (tempC >= 19) return 6;
    return 7;
}

function createScheduleStep(name, start, end, notes = '') {
    return {
        name,
        time: `${formatTime(start)} - ${formatTime(end)}`,
        duration: `${((end - start)/3600000).toFixed(1)} hours`,
        notes
    };
}

function formatTime(date) {
    return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
    });
}

function displayResults(recipe, schedule) {
    // Show ingredients
    let ingredientsHTML = `<h3>🧾 Recipe for ${document.getElementById('loaves').value} Loaf(s)</h3>`;
    ingredientsHTML += `
        <p>Flour: ${recipe.flour}g</p>
        <p>Water: ${recipe.water}g</p>
        <p>Salt: ${recipe.salt}g</p>
        <p>Starter: ${recipe.starter}g</p>
        <p>Total Dough: ${recipe.flour + recipe.water + recipe.salt + recipe.starter}g</p>
    `;
    document.getElementById('results').innerHTML = ingredientsHTML;

    // Show schedule
    let scheduleHTML = '<h3>⏰ Baking Schedule</h3>';
    schedule.forEach(step => {
        scheduleHTML += `
            <div class="schedule-step">
                <strong>${step.name}</strong><br>
                <em>${step.time}</em> (${step.duration})<br>
                ${step.notes}
            </div>
        `;
    });
    document.getElementById('schedule').innerHTML = scheduleHTML;
}

// Hydration slider update
document.getElementById('hydration').addEventListener('input', function() {
    document.getElementById('hydrationValue').textContent = `${this.value}%`;
});
