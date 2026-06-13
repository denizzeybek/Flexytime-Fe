import { computed,ref } from 'vue';

export const useTimer = () => {
  const elapsedTime = ref(0);
  const isRunning = ref(false);
  let timerInterval: any = null;

  const formattedElapsedTime = computed(() => {
    const hours = Math.floor(elapsedTime.value / 3600)
      .toString()
      .padStart(2, '0');
    const minutes = Math.floor((elapsedTime.value % 3600) / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (elapsedTime.value % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  });

  const startTimer = () => {
    if (!isRunning.value) {
      isRunning.value = true;
      timerInterval = setInterval(() => {
        elapsedTime.value += 1;
      }, 1000);
    }
  };

  const stopTimer = () => {
    if (isRunning.value) {
      isRunning.value = false;
      if (timerInterval !== null) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
    }
  };

  const resetTimer = () => {
    stopTimer();
    elapsedTime.value = 0;
  };
  return {
    elapsedTime,
    isRunning,
    formattedElapsedTime,
    startTimer,
    stopTimer,
    resetTimer
  };
};
