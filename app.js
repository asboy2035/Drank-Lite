// Drinks JSON object
const drinks = {
    water: 1,  // 100% hydration
    juice: 0.8,  // 80% hydration
    soda: 0.6,   // 60% hydration
    coffee: 0.5, // 50% hydration
    tea: 0.7    // 70% hydration
  };
  
  // Set up variables
  let dailyGoal = localStorage.getItem('dailyGoal') || 8;
  let hydrationProgress = localStorage.getItem('hydrationProgress') || 0;
  let today = new Date().toLocaleDateString();
  let lastLoggedDay = localStorage.getItem('lastLoggedDay') || today;
  
  // Initialize goal
  document.getElementById('goal').value = dailyGoal;
  
  // Fill drink options
  const drinkSelect = document.getElementById('drink-type');
  Object.keys(drinks).forEach(drink => {
    const option = document.createElement('option');
    option.value = drink;
    option.textContent = drink.charAt(0).toUpperCase() + drink.slice(1);
    drinkSelect.appendChild(option);
  });
  
  // Update progress bar and text
  function updateProgress() {
    const percentage = Math.min((hydrationProgress / dailyGoal) * 100, 100);
    document.getElementById('progress-bar').style.width = `${percentage}%`;
    document.getElementById('progress-text').textContent = `You have consumed ${percentage.toFixed(1)}% of your daily goal.`;
    
    // Show congratulations message
    if (percentage >= 100) {
      document.getElementById('congrats-message').textContent = 'You’ve reached your daily goal.';
      document.getElementById('congrats-message').style.display = 'block';
      document.getElementById('progress-text').style.display = 'none';
    } else {
      document.getElementById('congrats-message').style.display = 'none';
      document.getElementById('progress-text').style.display = 'block';
    }
  }
  
  // Modal handling
  const modal = document.getElementById('log-modal');
  const logWaterBtn = document.getElementById('log-water-btn');
  const closeModalBtn = document.querySelector('.close-btn');
  
  // Open the modal when the button is clicked
  logWaterBtn.addEventListener('click', () => {
    modal.style.display = 'flex';
  });
  
  // Close the modal when the close button is clicked
  closeModalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });
  
  // Close the modal if the user clicks outside of it
  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });
  
  // Log drink button inside modal
  document.getElementById('log-drink').addEventListener('click', () => {
    const selectedDrink = document.getElementById('drink-type').value;
    const amount = Number(document.getElementById('drink-amount').value);
    
    const hydrationFactor = drinks[selectedDrink];
    const hydrationAmount = amount * hydrationFactor;
    
    hydrationProgress = Number(hydrationProgress) + hydrationAmount;
    localStorage.setItem('hydrationProgress', hydrationProgress);
  
    updateProgress();
    
    // Close the modal after logging
    modal.style.display = 'none';
  });
  
  // Update daily goal
  document.getElementById('goal').addEventListener('change', (event) => {
    dailyGoal = Number(event.target.value);
    localStorage.setItem('dailyGoal', dailyGoal);
    updateProgress();
  });
  
  // Reset goal daily
  function resetDailyProgress() {
    if (today !== lastLoggedDay) {
      hydrationProgress = 0;
      localStorage.setItem('hydrationProgress', 0);
      localStorage.setItem('lastLoggedDay', today);
      updateProgress();
    }
  }
  
  resetDailyProgress();
  updateProgress();
  
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
    .then(() => console.log('Service Worker Registered'))
    .catch(error => console.error('Service Worker registration failed:', error));
  }