import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Float, Box, Sphere } from '@react-three/drei';
import ReactFlow, { Background, Controls } from 'reactflow';
import type { Edge, Node, NodeTypes } from 'reactflow';
import 'reactflow/dist/style.css';
import { Bot, User, CircleDollarSign } from 'lucide-react';

const AgentNode = ({ data }: { data: any }) => (
  <div className="bg-slate-900 border-2 border-cyan-500 rounded-lg p-4 w-64 shadow-lg shadow-cyan-500/20">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2 text-cyan-400">
        <Bot size={24} />
        <h3 className="font-bold">{data.label}</h3>
      </div>
      <div className="text-xs font-mono bg-cyan-950 px-2 py-1 rounded text-cyan-300">
        {data.status}
      </div>
    </div>
    <div className="text-sm text-slate-300 mb-2">
      Reputation: <span className="text-yellow-400">{data.reputation}</span>
    </div>
    <div className="text-xs text-slate-400 font-mono">
      {data.wallet}
    </div>
  </div>
);

const UserNode = ({ data }: { data: any }) => (
  <div className="bg-slate-800 border-2 border-purple-500 rounded-lg p-4 w-48 shadow-lg shadow-purple-500/20">
    <div className="flex items-center gap-2 text-purple-400 mb-2">
      <User size={24} />
      <h3 className="font-bold">{data.label}</h3>
    </div>
    <div className="text-xs text-slate-400 font-mono">
      {data.wallet}
    </div>
  </div>
);

const TransactionNode = ({ data }: { data: any }) => (
  <div className="bg-slate-950 border border-green-500/50 rounded-full py-2 px-4 shadow-lg shadow-green-500/10 flex items-center gap-2">
    <CircleDollarSign size={16} className="text-green-400" />
    <span className="text-green-400 font-mono text-sm">{data.amount} SOL</span>
  </div>
);

const nodeTypes: NodeTypes = {
  agent: AgentNode,
  user: UserNode,
  transaction: TransactionNode,
};

const initialNodes: Node[] = [
  { id: 'user-1', type: 'user', position: { x: 50, y: 100 }, data: { label: 'Client', wallet: '7x2a...9b4p' } },
  { id: 'agent-1', type: 'agent', position: { x: 350, y: 100 }, data: { label: 'Main Agent (GPT-4)', status: 'IDLE', reputation: '4.9/5.0 (124 jobs)', wallet: 'Aq3t...2m9X' } },
  { id: 'agent-2', type: 'agent', position: { x: 700, y: 50 }, data: { label: 'Sub Agent (Data)', status: 'WORKING', reputation: '4.5/5.0 (42 jobs)', wallet: 'Zp9w...4k1L' } },
  { id: 'agent-3', type: 'agent', position: { x: 700, y: 250 }, data: { label: 'Sub Agent (Vision)', status: 'IDLE', reputation: '4.8/5.0 (89 jobs)', wallet: 'Mx2q...8b3Y' } }
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: 'user-1', target: 'agent-1', animated: true, style: { stroke: '#a855f7', strokeWidth: 2 } },
  { id: 'e2-3', source: 'agent-1', target: 'agent-2', animated: true, style: { stroke: '#06b6d4', strokeWidth: 2 }, label: 'Delegate Task' },
  { id: 'e2-4', source: 'agent-1', target: 'agent-3', animated: false, style: { stroke: '#334155', strokeWidth: 2 } },
];

function CityBackground() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1} position={[-4, 2, -5]}>
        <Box args={[1, 1, 1]}><meshStandardMaterial color="#06b6d4" wireframe /></Box>
      </Float>
      <Float speed={1.5} rotationIntensity={0.8} floatIntensity={1.5} position={[4, 1, -8]}>
        <Sphere args={[0.8, 16, 16]}><meshStandardMaterial color="#a855f7" wireframe /></Sphere>
      </Float>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <gridHelper args={[50, 50, '#1e293b', '#0f172a']} position={[0, -1.99, 0]} />
      {[...Array(10)].map((_, i) => (
        <Box key={i} args={[2, Math.random() * 8 + 2, 2]} position={[Math.random() * 30 - 15, 0, Math.random() * -20 - 5]} receiveShadow castShadow>
          <meshStandardMaterial color="#1e293b" />
        </Box>
      ))}
      <ContactShadows position={[0, -1.9, 0]} opacity={0.4} scale={50} blur={2} far={10} />
      <Environment preset="city" />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
    </>
  );
}

function App() {
  const [nodes] = React.useState(initialNodes);
  const [edges] = React.useState(initialEdges);

  return (
    <div className="w-full h-screen relative bg-slate-950 overflow-hidden font-sans">
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 5, 10], fov: 50 }}><CityBackground /></Canvas>
      </div>
      <div className="absolute inset-0 z-10 pointer-events-none">
        <header className="p-6 flex justify-between items-center bg-slate-950/80 backdrop-blur-sm border-b border-slate-800">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Agent Arcade</h1>
            <p className="text-slate-400 text-sm mt-1">Live Economic Sandbox on Solana</p>
          </div>
          <div className="flex gap-4 pointer-events-auto">
            <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-700 transition-colors">Connect Wallet</button>
            <button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors shadow-lg shadow-cyan-500/20 font-semibold">Deploy Agent</button>
          </div>
        </header>
        <div className="h-[calc(100vh-89px)] w-full pointer-events-auto relative">
          <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} fitView className="bg-transparent">
            <Background color="#334155" gap={20} className="opacity-20" />
            <Controls className="bg-slate-900 border-slate-800 fill-white" />
          </ReactFlow>
          <div className="absolute bottom-8 left-8 w-80 bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-xl p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Bot className="text-cyan-400" />Hire Agent</h2>
            <p className="text-sm text-slate-300 mb-6">Initiate a task for the Main Agent via Solana Actions. The agent will process and potentially delegate.</p>
            <button
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white rounded-lg font-bold transition-all shadow-lg shadow-purple-500/20"
              onClick={async () => {
                try {
                  const res = await fetch('http://localhost:8080/api/actions/pay-agent');
                  if (!res.ok) throw new Error("Backend not reachable");
                  const data = await res.json();
                  alert(`[Solana Blink Triggered]\nAction: ${data.title}\nDescription: ${data.description}\n\nIn production, this would open a wallet prompt to sign the transaction.`);
                } catch (e) {
                  alert("Failed to connect to Solana Action Backend. Make sure the backend is running on port 8080.");
                }
              }}
            >
              Pay 0.01 SOL to Start
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
