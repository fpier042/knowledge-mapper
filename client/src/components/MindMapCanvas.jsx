import ReactFlow, { Controls, Background } from "@reactflow/reactflow";
import { useDrop } from "react-dnd";
import { useMindMap } from "../contexts/MindMapContext";

const MindMapCanvas = () => {
  const { state, dispatch } = useMindMap();
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "bookmark",
    drop: (item) => {
      dispatch({
        type: "ADD_NODE",
        payload: {
          id: `node-${Date.now()}`,
          position: { x: 100, y: 100 },
          data: { label: item.title, bookmarkId: item.id },
        },
      });
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div ref={drop} style={{ flex: 1, height: "100vh" }}>
      <ReactFlow nodes={state.nodes} edges={state.edges} fitView>
        <Background />
        <Controls />
      </ReactFlow>
      {isOver && <div className="drop-indicator">Drop here to create node</div>}
    </div>
  );
};
