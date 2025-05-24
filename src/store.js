import { create } from 'zustand';

const useNeurocrankStore = create((set, get) => ({
  cu: 32420,
  rawConcepts: 124,
  maxRawConcepts: 300,
  autoSculptors: 6,
  autoRate: 85, // per second
  sabotageShield: true,
  timeLeft: 16 * 60 + 42, // seconds
  event: { name: 'Blackout', time: 2 * 60 + 15 },
  researchProgress: 65, // percent

  // Actions
  crystallizeThoughtform: () => set((state) => ({ cu: state.cu + 12 })),
  buyRawConcepts: () => set((state) => {
    if (state.cu >= 400 && state.rawConcepts < state.maxRawConcepts) {
      return {
        cu: state.cu - 400,
        rawConcepts: Math.min(state.rawConcepts + 1, state.maxRawConcepts),
      };
    }
    return {};
  }),
  buyAutoSculptor: () => set((state) => {
    if (state.cu >= 750) {
      return {
        cu: state.cu - 750,
        autoSculptors: state.autoSculptors + 1,
      };
    }
    return {};
  }),
  tick: () => set((state) => {
    // Auto-generate CU
    const newCU = state.cu + state.autoSculptors * state.autoRate / 10;
    // Decrement timers
    const newTimeLeft = Math.max(0, state.timeLeft - 0.1);
    const newEventTime = state.event ? Math.max(0, state.event.time - 0.1) : 0;
    return {
      cu: newCU,
      timeLeft: newTimeLeft,
      event: state.event ? { ...state.event, time: newEventTime } : null,
    };
  }),
}));

export default useNeurocrankStore;

