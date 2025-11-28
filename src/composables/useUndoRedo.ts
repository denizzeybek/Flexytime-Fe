import { ref } from 'vue';

export interface Command<T> {
  execute: () => T;
  undo: () => T;
  description: string;
}

export const useUndoRedo = <T>(initialState: T) => {
  const history = ref<Command<T>[]>([]);
  const currentIndex = ref(-1);
  const currentState = ref<T>(JSON.parse(JSON.stringify(initialState)));

  const canUndo = ref(false);
  const canRedo = ref(false);

  const updateCanUndoRedo = () => {
    canUndo.value = currentIndex.value >= 0;
    canRedo.value = currentIndex.value < history.value.length - 1;
  };

  const execute = (command: Command<T>) => {
    // Remove any commands after current index (branching timeline)
    if (currentIndex.value < history.value.length - 1) {
      history.value = history.value.slice(0, currentIndex.value + 1);
    }

    // Execute command and save new state
    const newState = command.execute();
    currentState.value = newState;

    // Add to history
    history.value.push(command);
    currentIndex.value++;

    // Limit history to 50 items to prevent memory issues
    if (history.value.length > 50) {
      history.value.shift();
      currentIndex.value--;
    }

    updateCanUndoRedo();
    return newState;
  };

  const undo = () => {
    if (!canUndo.value) return currentState.value;

    const command = history.value[currentIndex.value];
    const newState = command.undo();
    currentState.value = newState;
    currentIndex.value--;

    updateCanUndoRedo();
    return newState;
  };

  const redo = () => {
    if (!canRedo.value) return currentState.value;

    currentIndex.value++;
    const command = history.value[currentIndex.value];
    const newState = command.execute();
    currentState.value = newState;

    updateCanUndoRedo();
    return newState;
  };

  const clear = () => {
    history.value = [];
    currentIndex.value = -1;
    updateCanUndoRedo();
  };

  const reset = (newInitialState: T) => {
    currentState.value = JSON.parse(JSON.stringify(newInitialState));
    clear();
  };

  const getHistory = () => {
    return history.value.map((cmd, index) => ({
      description: cmd.description,
      isCurrent: index === currentIndex.value,
    }));
  };

  return {
    currentState,
    canUndo,
    canRedo,
    execute,
    undo,
    redo,
    clear,
    reset,
    getHistory,
  };
};
