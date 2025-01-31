function generateRecipe() {
    // ... previous calculations remain the same

    // Detailed timeline generation
    const now = new Date();
    const feedingTime = new Date(now.getTime() - (12 * 60 * 60 * 1000));
    
    const scheduleHTML = `
        <div class="schedule-step">
            <h3><span class="timeline-marker">Starter Preparation</span></h3>
            <div class="process-steps">
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
            </div>
        </div>

        <div class="schedule-step">
            <h3><span class="timeline-marker">Dough Preparation</span></h3>
            <div class="process-steps">
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
            </div>
        </div>

        <div class="schedule-step">
            <h3><span class="timeline-marker">Shaping & Baking</span></h3>
            <div class="process-steps">
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
            </div>
        </div>
    `;

    document.getElementById('schedule').innerHTML = scheduleHTML;
}

// Time formatting helper
function formatTime(hours, minutes) {
    const time = new Date();
    if(typeof hours === 'object') { // Handle Date object
        return hours.toLocaleTimeString([], {hour: 'numeric', minute: '2-digit'});
    }
    time.setHours(hours, minutes || 0);
    return time.toLocaleTimeString([], {hour: 'numeric', minute: '2-digit'});
}
