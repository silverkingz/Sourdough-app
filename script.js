const recipes = {
            white: {
                ingredients: {
                    flour: 500,
                    water: 350,
                    salt: 10
                },
                steps: [
                    "Autolyse (mix flour + water)",
                    "Add starter + salt",
                    "Bulk fermentation with folds",
                    "Shape and cold proof",
                    "Bake at 250°C"
                ]
            },
            multigrain: {
                ingredients: {
                    flour: 400,
                    water: 300,
                    salt: 10,
                    grains: 100
                },
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
                ingredients: {
                    flour: 450,
                    water: 320,
                    salt: 10,
                    oats: 50
                },
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
                ingredients: {
                    flour: 500,
                    water: 350,
                    salt: 10,
                    cheese: 100,
                    jalapenos: 50
                },
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
            const doughPerLoaf = parseInt(document.getElementById('doughWeight').value) || 800;
            const hydration = parseInt(document.getElementById('hydration').value) / 100 || 0.7;
            const tempUnit = document.getElementById('tempUnit').value;
            const doughTemp = parseFloat(document.getElementById('temperature').value) || 22;
            const starterHydration = parseInt(document.getElementById('starterType').value) / 100 || 1;

            // Get selected recipe
            const recipe = recipes[recipeType];
            if (!recipe) return;

            // Calculate total dough weight
            const totalDough = doughPerLoaf * loaves;

            // Calculate scaled ingredients
            const scaledIngredients = {};
            for (const [ingredient, amount] of Object.entries(recipe.ingredients)) {
                scaledIngredients[ingredient] = (amount * (totalDough / doughPerLoaf) * loaves).toFixed(1);
            }

            // Adjust water for hydration
            scaledIngredients.water = (hydration * scaledIngredients.flour).toFixed(1);

            // Calculate bulk time
            const tempC = tempUnit === 'F' ? (doughTemp - 32) * 5/9 : doughTemp;
            const bulkHours = calculateBulkTime(tempC);

            // Generate schedule
            const now = new Date();
            const scheduleSteps = [];

            // Starter feeding
            const feedTime = new Date(now.getTime() - 12 * 60 * 60 * 1000);
            scheduleSteps.push(createStep(
                "Feed Starter",
                feedTime,
                `Use ${starterHydration * 100}% hydration (1:${starterHydration === 0.5 ? '2:2' : '1:1'} ratio)`
            ));

            // Autolyse
            const autolyseEnd = new Date(now.getTime() + 60 * 60 * 1000);
            scheduleSteps.push(createStep(
                "Autolyse",
                now,
                autolyseEnd,
                recipe.steps[0]
            ));

            // Bulk fermentation
            const bulkEnd = new Date(autolyseEnd.getTime() + bulkHours * 60 * 60 * 1000);
            scheduleSteps.push(createStep(
                "Bulk Fermentation",
                autolyseEnd,
                bulkEnd,
                `${recipe.steps[1]} (${bulkHours}h)`
            ));

            // Remaining steps
            let lastTime = bulkEnd;
            recipe.steps.slice(2).forEach((step, index) => {
                const duration = index === recipe.steps.length - 3 ? 1 : 0.5;
                const stepEnd = new Date(lastTime.getTime() + duration * 60 * 60 * 1000);
                scheduleSteps.push(createStep(
                    `Step ${index + 3}`,
                    lastTime,
                    stepEnd,
                    step
                ));
                lastTime = stepEnd;
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

        function createStep(name, start, end, notes) {
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

        function displayResults(ingredients, schedule) {
            // Show ingredients
            let ingredientsHTML = '<h3>🧾 Ingredients</h3>';
            for (const [name, amount] of Object.entries(ingredients)) {
                ingredientsHTML += `<p>${name.charAt(0).toUpperCase() + name.slice(1)}: ${amount}g</p>`;
            }
            document.getElementById('results').innerHTML = ingredientsHTML;

            // Show schedule
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
            document.getElementById('schedule').innerHTML = scheduleHTML;
        }

        // Hydration slider update
        document.getElementById('hydration').addEventListener('input', function() {
            document.getElementById('hydrationValue').textContent = `${this.value}%`;
        });
    </script>
</body>
</html>
