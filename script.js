const recipes = {
    white: {
        steps: [
            { step: "Feed starter", time: "-12h", duration: "12-14h", notes: "1:2:2 ratio (50g starter, 100g flour, 100g water)" },
            { step: "Autolyse", duration: "1h", notes: "Mix flour + water" },
            { step: "Mix dough", duration: "10min", notes: "Add starter + salt" },
            { step: "Bulk fermentation", duration: "4-5h", notes: "Fold every 30min (4x total)" },
            { step: "Pre-shape", duration: "20min", notes: "Bench rest" },
            { step: "Final shape", duration: "10min", notes: "Tight boule" },
            { step: "Cold proof", duration: "12-16h", notes: "Retard in fridge (4°C)" },
            { step: "Bake", duration: "40min", notes: "250°C with steam, then 220°C" }
        ]
    },
    multigrain: {
        steps: [
            { step: "Feed starter", time: "-12h", duration: "12-14h", notes: "1:2:2 ratio" },
            { step: "Soak grains", duration: "1h", notes: "Mix oats, seeds, flax in water" },
            { step: "Autolyse", duration: "1h", notes: "Flour + water" },
            { step: "Mix dough", duration: "12min", notes: "Add starter, salt, soaked grains" },
            { step: "Bulk fermentation", duration: "5-6h", notes: "Fold every 30min (5x total)" },
            { step: "Pre-shape", duration: "20min", notes: "Bench rest" },
            { step: "Final shape", duration: "10min", notes: "Batard shape" },
            { step: "Cold proof", duration: "12-16h", notes: "Retard in fridge" },
            { step: "Bake", duration: "45min", notes: "240°C with steam" }
        ]
    },
    oat: {
        steps: [
            { step: "Feed starter", time: "-12h", duration: "12-14h", notes: "1:2:2 ratio" },
            { step: "Soak oats", duration: "1h", notes: "Hydrate rolled oats in water" },
            { step: "Autolyse", duration: "1h", notes: "Flour + water" },
            { step: "Mix dough", duration: "10min", notes: "Add starter, salt, soaked oats" },
            { step: "Bulk fermentation", duration: "5h", notes: "Fold every 30min (4x total)" },
            { step: "Pre-shape", duration: "20min", notes: "Bench rest" },
            { step: "Final shape", duration: "10min", notes: "Round or oval" },
            { step: "Cold proof", duration: "12-16h", notes: "Retard in fridge" },
            { step: "Bake", duration: "40min", notes: "230°C with steam" }
        ]
    },
    jalapeno: {
        steps: [
            { step: "Feed starter", time: "-12h", duration: "12-14h", notes: "1:2:2 ratio" },
            { step: "Prep add-ins", duration: "10min", notes: "Dice jalapeños, grate cheddar" },
            { step: "Autolyse", duration: "1h", notes: "Flour + water" },
            { step: "Mix dough", duration: "10min", notes: "Add starter, salt" },
            { step: "Bulk fermentation", duration: "4.5h", notes: "Fold every 30min (4x total)" },
            { step: "Laminate add-ins", duration: "5min", notes: "Layer jalapeños + cheese" },
            { step: "Pre-shape", duration: "20min", notes: "Bench rest" },
            { step: "Final shape", duration: "10min", notes: "Batard or round" },
            { step: "Cold proof", duration: "12-16h", notes: "Retard in fridge" },
            { step: "Bake", duration: "45min", notes: "240°C with steam" }
        ]
    }
};

function openRecipe(evt, recipeName) {
    // Tab handling
    const tablinks = document.getElementsByClassName("tablink");
    Array.from(tablinks).forEach(tab => tab.classList.remove("active"));
    evt.currentTarget.classList.add("active");

    // Show selected recipe
    const recipeContents = document.getElementsByClassName("recipe-content");
    Array.from(recipeContents).forEach(content => content.style.display = "none");
    document.getElementById(recipeName).style.display = "block";

    // Populate recipe steps
    const recipe = recipes[recipeName];
    const container = document.getElementById(recipeName);
    container.innerHTML = `
        <div class="recipe-header">
            <h2>${container.querySelector('h2').innerText}</h2>
            <p class="yield">${container.querySelector('.yield').innerText}</p>
        </div>
        <table class="step-table">
            <tr>
                <th>Step</th>
                <th>Time</th>
                <th>Duration</th>
                <th>Notes</th>
            </tr>
            ${recipe.steps.map(step => `
                <tr>
                    <td>${step.step}</td>
                    <td>${step.time || ''}</td>
                    <td>${step.duration}</td>
                    <td>${step.notes}</td>
                </tr>
            `).join('')}
        </table>
    `;
}

function openSubTab(evt, tabName) {
    // Subtab handling
    const tablinks = document.getElementsByClassName("subtablink");
    Array.from(tablinks).forEach(tab => tab.classList.remove("active"));
    evt.currentTarget.classList.add("active");

    const tabcontents = document.getElementsByClassName("subtabcontent");
    Array.from(tabcontents).forEach(content => content.style.display = "none");
    document.getElementById(tabName).style.display = "block";
}

function generateSchedule() {
    // Schedule generation logic
    const startTime = document.getElementById('startTime').value;
    const recipeId = document.querySelector('.recipe-content[style*="display: block"]').id;
    
    // Time parsing logic
    // ... (implementation based on previous code)
}

// Initialize first recipe
openRecipe({ currentTarget: document.querySelector('.tablink') }, 'white');
