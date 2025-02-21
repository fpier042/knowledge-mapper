import { useCallback } from "react";
import ReactFlow, { addEdge, useNodesState, useEdgesState } from "reactflow";
import "reactflow/dist/style.css"; // Corrected import

function App() {
  const initialNodes = [
    { id: "1", position: { x: 0, y: 0 }, data: { label: "Start Here!" } },
  ];
  const initialEdges = [];

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      />
    </div>
  );
}

export default App;