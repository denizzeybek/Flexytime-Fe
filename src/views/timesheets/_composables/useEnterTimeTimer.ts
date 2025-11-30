import { computed, onUnmounted, ref } from 'vue';

export const useEnterTimeTimer = () => {
  const elapsedTime = ref(0);
  const isRunning = ref(false);
  let timerInterval: ReturnType<typeof setInterval> | null = null;
  let timerStartTime: Date | null = null;

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
      timerStartTime = new Date();
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
    timerStartTime = null;
  };

  const getTimerStartTime = () => timerStartTime;

  const formatElapsedTimeForPayload = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  // Cleanup on unmount
  onUnmounted(() => {
    if (timerInterval) {
      clearInterval(timerInterval);
    }
  });

  return {
    elapsedTime,
    isRunning,
    formattedElapsedTime,
    startTimer,
    stopTimer,
    resetTimer,
    getTimerStartTime,
    formatElapsedTimeForPayload,
  };
};
