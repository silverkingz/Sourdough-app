const recipes = {
    white: {
        flour: 0.625, // 500g flour / 800g dough
        water: 0.4375, // 350g water / 800g dough
        salt: 0.0125, // 10g salt / 800g dough
        steps: [
            "Autolyse (mix flour + water)",
            "Add starter + salt",
            "Bulk fermentation with folds",
            "Shape and cold proof",
            "Bake at 250°C"
        ]
    },
    multigrain: {
        flour: 0.5, // 400g flour / 800g dough
        water: 0.375, // 300g water / 800g dough
        salt: 0.0125, // 10g salt / 800g dough
        grains: 0.125, // 100g grains / 800g dough
        steps: [
            "Soak grains",
            "Autolyse with flour + water",
            "Add grains + starter + salt",
            "Extended bulk fermentation",
            "Shape and cold proof",
            "Bake at 240°C"
        ]
    },
    oat: {
        flour: 0.6, // 450g flour / 750g dough
        water: 0.4267, // 320g water / 750g dough
        salt: 0.0133, // 10g salt / 750g dough
        oats: 0.0667, // 50g oats / 750g dough
        steps: [
            "Soak oats",
            "Autolyse with flour + water",
            "Add oats + starter + salt",
            "Bulk fermentation with folds",
            "Shape and cold proof",
            "Bake at 230°C"
        ]
    },
    jalapeno: {
        flour: 0.625, // 500g flour / 800g dough
        water: 0.4375, // 350g water / 800g dough
        salt: 0.0125, // 10g salt / 800g dough
        cheese: 0.125, // 100g cheese / 800g dough
        jalapenos: 0.0625, // 50g jalapenos / 800g dough
        steps: [
            "Prepare add-ins",
            "Autolyse with flour + water",
            "Add starter + salt",
            "Laminate add-ins",
            "Shape and cold proof",
            "Bake at 240°C"
        ]
    }
};

function generateRecipe() {
    // Get inputs
    const recipeType = document.getElementById('recipe').value;
    const loaves = parseFloat(document.getElementById('loaves').value) || 1;
    const doughPerLoaf = parseFloat(document.getElementById('doughWeight').value) || 800;
    const hydration = parseFloat(document.getElementById('hydration').value) / 100 || 0.7;
    const tempUnit = document.getElementById('tempUnit').value;
    const doughTemp = parseFloat(document.getElementById('temperature').value) || 22;
    const starterHydration = parseFloat(document.getElementById('starterType').value) / 100 || 1;

    // Get selected recipe
    const recipe = recipes[recipeType];

    // Calculate scaled ingredients
    const totalDough = doughPerLoaf * loaves;
    const scaledRecipe = {};
    for (const [ingredient, ratio] of Object.entries(recipe)) {
        if (typeof ratio === 'number') {
            scaledRecipe[ingredient] = (ratio * totalDough).toFixed(1);
        }
    }

    // Adjust water for hydration
    scaledRecipe.water = (hydration * scaledRecipe.flour).toFixed(1);

    // Calculate bulk time based on temperature
    const bulkHours = calculateBulkTime(
        tempUnit === 'F' ? (doughTemp - 32) * 5/9 : doughTemp
    );

    // Generate schedule
    const now = new Date();
    const scheduleSteps = [];

    // Starter feeding (12 hours before autolyse)
    const starterFeedTime = new Date(now.getTime() - 12 * 60 * 60 * 1000);
    scheduleSteps.push(createScheduleStep(
        "Feed Starter",
        starterFeedTime,
        `Mix ${starterHydration === 0.5 ? '1:2:2' : '1:1:1'} ratio (${starterHydration * 100}% hydration)`
    ));

    // Autolyse (current time)
    const autolyseEnd = new Date(now.getTime() + 60 * 60 * 1000);
    scheduleSteps.push(createScheduleStep(
        "Autolyse",
        now,
        autolyseEnd,
        recipe.steps[0]
    ));

    // Bulk fermentation
    const bulkEnd = new Date(autolyseEnd.getTime() + bulkHours * 60 * 60 * 1000);
    scheduleSteps.push(createScheduleStep(
        "Bulk Fermentation",
        autolyseEnd,
        bulkEnd,
        `${recipe.steps[1]} (${bulkHours} hours)`
    ));

    // Remaining steps (fixed timing)
    let lastTime = bulkEnd;
    for (let i = 2; i < recipe.steps.length; i++) {
        const stepDuration = i === recipe.steps.length - 1 ? 1 : 0.5; // Baking takes 1 hour
        const stepEnd = new Date(lastTime.getTime() + stepDuration * 60 * 60 * 1000);
        scheduleSteps.push(createScheduleStep(
            `Step ${i + 1}`,
            lastTime,
            stepEnd,
            recipe.steps[i]
        ));
        lastTime = stepEnd;
    }

    // Display results
    displayResults(scaledRecipe, scheduleSteps);
}

function calculateBulkTime(tempC) {
    if (tempC >= 25) return 4;
    if (tempC >= 22) return 5;
    if (tempC >= 19) return 6;
    return 7;
}

function createScheduleStep(name, start, end, notes) {
    return {
        name,
        time: `${formatTime(start)} - ${formatTime(end)}`,
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
    // Display ingredients
    let ingredientsHTML = '<h3>🧾 Scaled Recipe</h3>';
    for (const [ingredient, amount] of Object.entries(recipe)) {
        ingredientsHTML += `<p>${ingredient.charAt(0).toUpperCase() + ingredient.slice(1)}: ${amount}g</p>`;
    }

    // Display schedule
    let scheduleHTML = '<h3>⏰ Schedule</h3>';
    schedule.forEach(step => {
        scheduleHTML += `
            <div class="schedule-step">
                <strong>${step.name}</strong><br>
                <em>${step.time}</em><br>
                ${step.notes}
            </div>
        `;
    });

    document.getElementById('results').innerHTML = ingredientsHTML;
    document.getElementById('schedule').innerHTML = scheduleHTML;
}

// Hydration slider update
document.getElementById('hydration').addEventListener('input', function() {
    document.getElementById('hydrationValue').textContent = `${this.value}%`;
});
