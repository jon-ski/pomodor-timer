import './css/tailwind.css';
import Alpine from 'alpinejs';

// Cookie handling functions
function getCookie(name) {
  const nameEQ = encodeURIComponent(name) + '=';
  const ca = document.cookie.split(';');
  for (let c of ca) {
    c = c.trim();
    if (c.indexOf(nameEQ) === 0) {
      return decodeURIComponent(c.substring(nameEQ.length));
    }
  }
  return undefined;
}

function setCookie(name, value) {
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; path=/`;
}

// Define the Alpine.js component
function pomodoroTimer() {
  return {
    // Data properties
    pomodoroTime: parseInt(getCookie('pomodoroTime')) || 25,
    breakTime: parseInt(getCookie('breakTime')) || 5,
    pomodoroTimeInput: parseInt(getCookie('pomodoroTime')) || 25,
    breakTimeInput: parseInt(getCookie('breakTime')) || 5,
    isPomodoro: true,
    timerInterval: null,
    remainingTime: 0,
    isRunning: false,
    formattedTime: '',

    // Initialize the timer
    init() {
      this.remainingTime = this.pomodoroTime * 60;
      this.updateTimerDisplay();
    },

    // Update the timer display
    updateTimerDisplay() {
      const minutes = Math.floor(this.remainingTime / 60);
      const seconds = this.remainingTime % 60;
      this.formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    },

    // Update times when inputs change
    updateTimes() {
      this.pomodoroTime = this.pomodoroTimeInput || 25;
      this.breakTime = this.breakTimeInput || 5;
      setCookie('pomodoroTime', this.pomodoroTime);
      setCookie('breakTime', this.breakTime);
      if (!this.isRunning) {
        this.remainingTime = (this.isPomodoro ? this.pomodoroTime : this.breakTime) * 60;
        this.updateTimerDisplay();
      }
    },

    // Start the timer
    startTimer() {
      if (this.isRunning) return;
      this.isRunning = true;
      this.timerInterval = setInterval(() => {
        if (this.remainingTime > 0) {
          this.remainingTime--;
          this.updateTimerDisplay();
        } else {
          this.playBeep();
          alert(`${this.isPomodoro ? 'Pomodoro' : 'Break'} session ended!`);
          this.isPomodoro = !this.isPomodoro;
          this.remainingTime = (this.isPomodoro ? this.pomodoroTime : this.breakTime) * 60;
          this.updateTimerDisplay();
        }
      }, 1000);
    },

    // Pause the timer
    pauseTimer() {
      if (!this.isRunning) return;
      clearInterval(this.timerInterval);
      this.isRunning = false;
    },

    // Reset the timer
    resetTimer() {
      clearInterval(this.timerInterval);
      this.isRunning = false;
      this.isPomodoro = true;
      this.remainingTime = this.pomodoroTime * 60;
      this.updateTimerDisplay();
    },

    // Play beep sound
    playBeep() {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = ctx.createOscillator();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(1000, ctx.currentTime);
      oscillator.connect(ctx.destination);
      oscillator.start();
      oscillator.stop(ctx.currentTime + 1);
    }
  };
}

// Expose the function globally
window.pomodoroTimer = pomodoroTimer;

Alpine.start();