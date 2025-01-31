// Global variables
let currentTab = "starter";

// Open tabs
function openTab(evt, tabName) {
    currentTab = tabName;
    document.querySelectorAll(".tabcontent").forEach(tab => tab.style.display = "none");
    document.querySelectorAll(".tablink").forEach(btn => btn.classList.remove("active"));
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.classList.add("active");
}

// Calculate recipe and workflow
function calculateRecipe() {
    // Trigger Google Ad
    (adsbygoogle = window.adsbygoogle || []).push({});

    // Get inputs
    const loaves = parseInt(document.getElementById("loaves").value);
    const flourPerLoaf = parseInt(document.getElementById("flour").value);
    const hydration = parseInt(document.getElementById("hydration").value);
    const starterHydration = parseInt(document.getElementById("starterHydration").value) / 100; // 100% → 1.0
    const starterPercent = parseInt(document.getElementById("starterPercent").value) / 100; // 20% → 0.2

    // Baker's Math Calculations
    const totalFlour = flourPerLoaf * loaves;
    const totalWater = totalFlour * (hydration / 100);
    const starterFlour = totalFlour * starterPercent;
    const starterWater = starterFlour * starterHydration;
    const salt = totalFlour * 0.02; // 2% salt

    // Adjust for starter contribution (subtract starter's flour/water from total)
    const adjustedFlour = totalFlour - starterFlour;
    const adjustedWater = totalWater - starterWater;

    // Baker's Percentages
    const bakersPercentages = {
        flour: 100,
        water: (adjustedWater / adjustedFlour * 100).toFixed(1),
        starter: (starterPercent * 100).toFixed(1),
        salt: 2.0
    };

    // Display Results
    document.getElementById("results").innerHTML = `
        <h3>Recipe for ${loaves} Loaf${loaves > 1 ? 's' : ''}</h3>
        <p>Total Flour: ${adjustedFlour.toFixed(1)}g</p>
        <p>Total Water: ${adjustedWater.toFixed(1)}g</p>
        <p>Starter: ${starterFlour.toFixed(1)}g flour + ${starterWater.toFixed(1)}g water</p>
        <p>Salt: ${salt.toFixed(1)}g</p>
    `;

    // Baker's % Tab
    document.getElementById("bakersPercentages").innerHTML = `
        <h4>Baker's Percentages</h4>
        <p>Flour: ${bakersPercentages.flour}%</p>
        <p>Water: ${bakersPercentages.water}%</p>
        <p>Starter: ${bakersPercentages.starter}%</p>
        <p>Salt: ${bakersPercentages.salt}%</p>
    `;

    // Generate Workflow
    generateWorkflow();
}

// Workflow Generator (Including Starter Feeding)
function generateWorkflow() {
    const now = new Date();
    const steps = [];

    // Starter Feeding (12h before autolyse)
    const starterFeedTime = new Date(now.getTime() - 12 * 60 * 60 * 1000);
    steps.push({
        name: "Feed Starter",
        time: starterFeedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    // Autolyse (Now + 1h)
    const autolyseEnd = new Date(now.getTime() + 60 * 60 * 1000);
    steps.push({
        name: "Autolyse",
        time: `Now - ${autolyseEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    });

    // Bulk Fermentation (4-6h based on temp)
    const bulkHours = 5; // Adjust based on temp later
    const bulkEnd = new Date(autolyseEnd.getTime() + bulkHours * 60 * 60 * 1000);
    steps.push({
        name: "Bulk Fermentation",
        time: `${autolyseEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${bulkEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    });

    // Build Workflow HTML
    let workflowHTML = "<h3>⏰ Schedule</h3>";
    steps.forEach(step => {
        workflowHTML += `<p><strong>${step.name}:</strong> ${step.time}</p>`;
    });
    document.getElementById("workflow").innerHTML = workflowHTML;
}

// Initialize
document.getElementById("hydration").addEventListener("input", function() {
    document.getElementById("hydrationValue").textContent = `${this.value}%`;
});
openTab(null, 'starter'); // Open starter tab by default