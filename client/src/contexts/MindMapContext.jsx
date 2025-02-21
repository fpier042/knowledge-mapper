import { createContext, useReducer } from "react";
import { ReactFlowProvider } from "reactflow";

const MindMapContext = createContext();

const initialState = {
  nodes: [],
  edges: [],
  selectedNode: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_NODE":
      return {
        ...state,
        nodes: [...state.nodes, action.payload],
      };
    // Add other cases
    default:
      return state;
  }
};

export const MindMapProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <ReactFlowProvider>
      <MindMapContext.Provider value={{ state, dispatch }}>
        {children}
      </MindMapContext.Provider>
    </ReactFlowProvider>
  );
};