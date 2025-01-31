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

    // Detailed schedule generation
    const now = new Date();
    const feedingTime = new Date(now.getTime() - (12 * 60 * 60 * 1000));
    
    const scheduleHTML = `
        <h2>Complete Baking Schedule</h2>
        
        <div class="schedule-step">
            <h3><span class="timeline-marker">Starter Preparation</span></h3>
            <ul class="process-steps">
                <li>
                    <strong>${formatTime(feedingTime)}:</strong> Feed starter
                    <br>${starterType === 'stiff' ? 
                        '100g mature starter + 500g flour + 250g water' : 
                        '100g mature starter + 400g flour + 400g water'}
                    <span class="temperature-badge">${temperature}°${isCelsius ? 'C' : 'F'}</span>
                </li>
                <li>
                    <strong>${formatTime(feedingTime.getHours(), feedingTime.getMinutes()+30)}:</strong>
                    Mix thoroughly until no dry flour remains
                </li>
                <li>
                    <strong>Next 12 hours:</strong> Maintain temperature between 
                    ${temperature-2}°-${temperature+2}°${isCelsius ? 'C' : 'F'}
                </li>
            </ul>
        </div>

        <div class="schedule-step">
            <h3><span class="timeline-marker">Dough Preparation</span></h3>
            <ul class="process-steps">
                <li>
                    <strong>${formatTime(8,30)}:</strong> Autolyse
                    <br>Mix ${Math.round(mainFlour)}g flour + ${Math.round(mainWater)}g water
                </li>
                <li>
                    <strong>${formatTime(9,30)}:</strong> Add starter and salt
                    <br>Incorporate ${Math.round(starterAmount)}g starter + ${Math.round(salt)}g salt
                </li>
                <li>
                    <strong>${formatTime(9,35)}-${formatTime(1,30)}:</strong> Bulk fermentation (${bulkTime} mins)
                    <ul class="fold-schedule">
                        <li>${formatTime(9,45)}: First fold</li>
                        <li>${formatTime(10,15)}: Second fold</li>
                        <li>${formatTime(10,45)}: Third fold</li>
                        <li>${formatTime(11,15)}: Final fold</li>
                    </ul>
                </li>
            </ul>
        </div>

        <div class="schedule-step">
            <h3><span class="timeline-marker">Shaping & Baking</span></h3>
            <ul class="process-steps">
                <li>
                    <strong>${formatTime(1,30)}:</strong> Pre-shape
                    <br>Divide into ${loaves} x ${doughWeight}g pieces
                </li>
                <li>
                    <strong>${formatTime(2,0)}:</strong> Final shape
                    <br>Create surface tension, dust with rice flour
                </li>
                <li>
                    <strong>${formatTime(2,30)}-${formatTime(6,0)}:</strong> Final proof
                    <br>${proofTime} mins at ${temperature}°${isCelsius ? 'C' : 'F'} 
                    or refrigerate overnight
                </li>
                <li>
                    <strong>${formatTime(5,15)}:</strong> Preheat oven
                    <br>Dutch oven to 250°C/480°F
                </li>
                <li>
                    <strong>${formatTime(6,0)}:</strong> Bake
                    <br>20 mins covered + 25-30 mins uncovered
                </li>
                <li>
                    <strong>${formatTime(6,30)}:</strong> Cool
                    <br>2 hours minimum on wire rack
                </li>
            </ul>
        </div>
    `;

    document.getElementById('results').innerHTML = ingredientsHTML;
    document.getElementById('schedule').innerHTML = scheduleHTML;
}

function formatTime(hours, minutes) {
    const time = new Date();
    if(typeof hours === 'object') {
        return hours.toLocaleTimeString([], {hour: 'numeric', minute: '2-digit'});
    }
    time.setHours(hours, minutes || 0);
    return time.toLocaleTimeString([], {hour: 'numeric', minute: '2-digit'});
}
