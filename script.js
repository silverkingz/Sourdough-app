let isCelsius = true;

function toggleUnit() {
    isCelsius = !isCelsius;
    const tempInput = document.getElementById('temperature');
    if (isCelsius) {
        tempInput.value = Math.round((tempInput.value - 32) * 5/9);
    } else {
        tempInput.value = Math.round((tempInput.value * 9/5) + 32);
    }
}

document.getElementById('hydration').addEventListener('input', function(e) {
    document.getElementById('hydrationValue').textContent = `${e.target.value}%`;
});

function calculateRecipe() {
    const loaves = parseInt(document.getElementById('loaves').value);
    const doughWeight = parseInt(document.getElementById('doughWeight').value);
    const hydration = parseInt(document.getElementById('hydration').value);
    const temperature = parseFloat(document.getElementById('temperature').value);
    const starterType = document.getElementById('starterType').value;

    // Calculate total dough weight
    const totalDough = doughWeight * loaves;

    // Calculate starter parameters
    const starterHydration = starterType === 'stiff' ? 0.5 : 1.0;
    const starterRatio = 0.2;

    // Calculate total flour and water
    const totalFlour = totalDough / (1 + hydration/100 + starterRatio);
    const totalWater = (totalFlour * hydration/100);
    const starterAmount = totalFlour * starterRatio;

    // Calculate starter components
    const starterFlour = starterAmount / (1 + starterHydration);
    const starterWater = starterAmount - starterFlour;

    // Calculate final ingredients
    const mainFlour = totalFlour - starterFlour;
    const mainWater = totalWater - starterWater;
    const salt = totalFlour * 0.02;

    // Calculate fermentation times
    const baseTemp = 20;
    const tempFactor = baseTemp / temperature;
    const bulkFermentation = Math.round(4 * 60 * tempFactor);
    const proofTime = Math.round(2 * 60 * tempFactor);

    // Generate schedule
    const schedule = `
        <h3>Ingredients:</h3>
        <ul>
            <li>Main flour: ${Math.round(mainFlour)}g</li>
            <li>Water: ${Math.round(mainWater)}g</li>
            <li>Salt: ${Math.round(salt)}g</li>
            <li>Starter: ${Math.round(starterAmount)}g (${starterType})</li>
        </ul>

        <h3>Schedule:</h3>
        <ol>
            <li>12 hours before: Feed starter</li>
            <li>Mix all ingredients (autolyse)</li>
            <li>Bulk fermentation: ${bulkFermentation} minutes</li>
            <li>Shape dough</li>
            <li>Final proof: ${proofTime} minutes</li>
            <li>Bake at 250°C for 30 minutes</li>
        </ol>
    `;

    document.getElementById('results').innerHTML = schedule;
}

// PayPal integration
document.addEventListener('DOMContentLoaded', function() {
    paypal.Buttons({
        style: {
            shape: 'rect',
            color: 'gold',
            layout: 'horizontal',
            label: 'donate'
        },
        createOrder: function(data, actions) {
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: '5.00'
                    }
                }]
            });
        }
    }).render('#paypal-button-container');
});
