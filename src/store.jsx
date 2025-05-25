import React, { createContext, useContext, useReducer, useEffect } from "react";

// --- Sock Multiverse State ---
const initialState = {
  lint: 0,
  sockPower: 0,
  socksSecured: 0,
  generators: {
    giantLintFilter: 0,
    dryerLintExtractor: 0,
    sockVortexAmplifier: 0,
    laundryDemon: 0,
  },
  lastEmergencySockTime: null,
};

const GENERATOR_CONFIG = {
  giantLintFilter: { name: "Giant Lint Filter", baseCost: 10, lintPerSec: 0.1, emoji: "🧹" },
  dryerLintExtractor: { name: "Dryer Lint Extractor", baseCost: 75, lintPerSec: 0.5, emoji: "🌀" },
  sockVortexAmplifier: { name: "Sock Vortex Amplifier", baseCost: 250, lintPerSec: 1.5, emoji: "🧲" },
  laundryDemon: { name: "Unlicensed Laundry Demon with a Shop-Vac", baseCost: 1000, lintPerSec: 5, emoji: "😈" },
};

function getGeneratorCost(type, owned) {
  return Math.floor(GENERATOR_CONFIG[type].baseCost * Math.pow(1.15, owned));
}

function reducer(state, action) {
  switch (action.type) {
    case "YOINK_SOCK":
      return {
        ...state,
        lint: state.lint + 1,
        socksSecured: state.socksSecured + 1,
      };
    case "BUY_GENERATOR": {
      const { genType } = action;
      const owned = state.generators[genType];
      const cost = getGeneratorCost(genType, owned);
      if (state.lint < cost) return state;
      return {
        ...state,
        lint: state.lint - cost,
        generators: {
          ...state.generators,
          [genType]: owned + 1,
        },
      };
    }
    case "TICK": {
      let lintGain = 0;
      Object.keys(state.generators).forEach(type => {
        lintGain += state.generators[type] * GENERATOR_CONFIG[type].lintPerSec / 10;
      });
      return {
        ...state,
        lint: state.lint + lintGain,
      };
    }
    case "SMACK_DRYER": {
      return {
        ...state,
        lint: state.lint + 1,
        lastEmergencySockTime: Date.now(),
      };
    }
    default:
      return state;
  }
}

const SockContext = createContext();

export function SockProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Passive income tick every 100ms
  useEffect(() => {
    const interval = setInterval(() => dispatch({ type: "TICK" }), 100);
    return () => clearInterval(interval);
  }, []);

  // Actions
  const yoinkSock = () => dispatch({ type: "YOINK_SOCK" });
  const buyGenerator = (genType) => dispatch({ type: "BUY_GENERATOR", genType });
  const smackDryer = () => dispatch({ type: "SMACK_DRYER" });

  return (
    <SockContext.Provider value={{
      ...state,
      yoinkSock,
      buyGenerator,
      smackDryer,
      getGeneratorCost,
      GENERATOR_CONFIG,
    }}>
      {children}
    </SockContext.Provider>
  );
}

export function useSockverse() {
  return useContext(SockContext);
}
