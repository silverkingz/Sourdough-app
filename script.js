const recipes = {
    white: {
        baseWeight: 800,  // Reference dough weight for 1 loaf
        ingredients: { flour: 500, water: 350, salt: 10 },
        steps: [
            "Autolyse (mix flour + water)",
            "Add starter + salt",
            "Bulk fermentation with folds",
            "Shape and cold proof",
            "Bake at 250°C"
        ]
    },
    multigrain: {
        baseWeight: 800,
        ingredients: { flour: 400, water: 300, salt: 10, grains: 100 },
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
        baseWeight: 750,
        ingredients: { flour: 450, water: 320, salt: 10, oats: 50 },
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
        baseWeight: 800,
        ingredients: { flour: 500, water: 350, salt: 10, cheese: 100, jalapenos: 50 },
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
    // Clear previous results
    document.getElementById('results').innerHTML = '';
    document.getElementById('schedule').innerHTML = '';

    // Get inputs
    const recipeType = document.getElementById('recipe').value;
    const loaves = parseInt(document.getElementById('loaves').value) || 1;
    const doughPerLoaf = parseInt(document.getElementById('doughWeight').value) || recipes[recipeType].baseWeight;
    const hydration = parseInt(document.getElementById('hydration').value) / 100 || 0.7;
    const tempUnit = document.getElementById('tempUnit').value;
    const doughTemp = parseFloat(document.getElementById('temperature').value) || 22;
    const starterHydration = parseInt(document.getElementById('starterType').value) / 100 || 1;

    // Get selected recipe
    const recipe = recipes[recipeType];
    if (!recipe) {
        alert("Please select a valid recipe.");
        return;
    }

    // Calculate scaling factor
    const scalingFactor = (doughPerLoaf / recipe.baseWeight) * loaves;

    // Scale ingredients
    const scaledIngredients = {};
    for (const [ingredient, amount] of Object.entries(recipe.ingredients)) {
        scaledIngredients[ingredient] = Math.round(amount * scalingFactor);
    }

    // Adjust hydration
    const totalFlour = scaledIngredients.flour;
    const targetWater = totalFlour * hydration;
    scaledIngredients.water = Math.round(targetWater);

    // Calculate bulk time
    const tempC = tempUnit === 'F' ? (doughTemp - 32) * 5/9 : doughTemp;
    const bulkHours = calculateBulkTime(tempC);

    // Generate schedule
    const now = new Date();
    const scheduleSteps = [];

    // Starter feeding (12 hours before)
    const feedTime = new Date(now.getTime() - 12 * 60 * 60 * 1000);
    scheduleSteps.push(createScheduleStep(
        "Feed Starter",
        feedTime,
        `Use ${starterHydration * 100}% hydration starter`
    ));

    // Recipe steps
    let currentTime = new Date(now.getTime());
    recipe.steps.forEach((step, index) => {
        const duration = index === recipe.steps.length - 1 ? 1 :  // Bake time
                       index === 2 ? bulkHours :                  // Bulk fermentation
                       0.5;                                       // Other steps
        const endTime = new Date(currentTime.getTime() + duration * 60 * 60 * 1000);
        
        scheduleSteps.push(createScheduleStep(
            step,
            currentTime,
            endTime
        ));
        currentTime = endTime;
    });

    // Display results
    displayResults(scaledIngredients, scheduleSteps);
}

function calculateBulkTime(tempC) {
    if (tempC >= 25) return 4;
    if (tempC >= 22) return 5;
    if (tempC >= 19) return 6;
    return 7;
}

function createScheduleStep(name, start, end) {
    return {
        name,
        time: `${formatTime(start)} - ${formatTime(end)}`,
        duration: `${((end - start) / 3600000).toFixed(1)} hours`
    };
}

function formatTime(date) {
    return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
    });
}

function displayResults(ingredients, schedule) {
    // Ingredients
    let ingredientsHTML = '<h3>🧾 Ingredients</h3>';
    for (const [name, amount] of Object.entries(ingredients)) {
        ingredientsHTML += `<p><strong>${name}:</strong> ${amount}g</p>`;
    }
    document.getElementById('results').innerHTML = ingredientsHTML;

    // Schedule
    let scheduleHTML = '<h3>⏰ Schedule</h3>';
    schedule.forEach(step => {
        scheduleHTML += `
            <div class="schedule-step">
                <strong>${step.name}</strong><br>
                <em>${step.time}</em> (${step.duration})
            </div>
        `;
    });
    document.getElementById('schedule').innerHTML = scheduleHTML;
}

// Hydration slider update
document.getElementById('hydration').addEventListener('input', function() {
    document.getElementById('hydrationValue').textContent = `${this.value}%`;
});
