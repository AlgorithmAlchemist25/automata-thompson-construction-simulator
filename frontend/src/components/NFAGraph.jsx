
import { useMemo } from "react";

import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    MarkerType
} from "@xyflow/react";

import dagre from "@dagrejs/dagre";

// Larger and more readable NFA states
const NODE_WIDTH = 84;
const NODE_HEIGHT = 84;

function createLayout(
    nfa,
    activeStates = [],
    previousSnapshot = null
) {
    if (!nfa) {
        return { nodes: [], edges: [] };
    }

    const graph = new dagre.graphlib.Graph();

    graph.setDefaultEdgeLabel(() => ({}));

    // Improved graph spacing
    graph.setGraph({
        rankdir: "LR",
        nodesep: 85,
        ranksep: 130,
        marginx: 40,
        marginy: 40,
    });

    nfa.states.forEach((state) => {
        graph.setNode(String(state), {
            width: NODE_WIDTH,
            height: NODE_HEIGHT,
        });
    });

    nfa.transitions.forEach((transition) => {
        graph.setEdge(
            String(transition.from),
            String(transition.to)
        );
    });

    dagre.layout(graph);

    const previousStates = new Set(
        previousSnapshot?.states || []
    );

    const previousTransitionCount =
        previousSnapshot?.transitions?.length || 0;

    // Create graph nodes
    const nodes = nfa.states.map((state) => {

        const position = graph.node(String(state));

        const isStart = state === nfa.start_state;
        const isFinal = state === nfa.accept_state;
        const isActive = activeStates.includes(state);

        const isNew = previousSnapshot
            ? !previousStates.has(state)
            : false;

        return {
            id: String(state),

            position: {
                x: position.x - NODE_WIDTH / 2,
                y: position.y - NODE_HEIGHT / 2,
            },

            data: {
                label: (
                    <span>
                        {isStart ? "→ " : ""}
                        q{state}
                    </span>
                ),
            },

            style: {
                width: NODE_WIDTH,
                height: NODE_HEIGHT,
                borderRadius: "50%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontWeight: "bold",
                fontSize: "15px",
                color: "#1e293b",

                background: isActive
                    ? "#facc15"
                    : isNew
                    ? "#fef3c7"
                    : isStart
                    ? "#dbeafe"
                    : isFinal
                    ? "#dcfce7"
                    : "#ffffff",

                border: isFinal
                    ? "5px double #16a34a"
                    : isActive
                    ? "3px solid #ca8a04"
                    : isNew
                    ? "3px solid #f59e0b"
                    : isStart
                    ? "3px solid #2563eb"
                    : "2px solid #2563eb",

                boxShadow: isActive
                    ? "0 0 12px rgba(250, 204, 21, 0.5)"
                    : "0 2px 8px rgba(15, 23, 42, 0.08)",
            },
        };
    });

    // Create graph transitions
    const edges = nfa.transitions.map(
        (transition, index) => {

            const isNew = index >= previousTransitionCount;

            return {
                id: `edge-${index}`,

                source: String(transition.from),
                target: String(transition.to),

                label: transition.symbol,

                type: "default",

                markerEnd: {
                    type: MarkerType.ArrowClosed,
                    color: isNew ? "#f59e0b" : "#64748b",
                },

                style: {
                    stroke: isNew ? "#f59e0b" : "#64748b",
                    strokeWidth: isNew ? 3 : 2,
                },

                labelStyle: {
                    fill: isNew ? "#d97706" : "#dc2626",
                    fontWeight: "bold",
                    fontSize: 13,
                },

                labelBgStyle: {
                    fill: "#ffffff",
                },

                labelBgPadding: [5, 3],
                labelBgBorderRadius: 4,
            };
        }
    );

    return { nodes, edges };
}

export default function NFAGraph({
    nfa,
    activeStates = [],
    constructionSnapshot = null,
    previousSnapshot = null,
}) {

    // Show selected construction stage or complete NFA
    const displayedNFA = constructionSnapshot || nfa;

    const { nodes, edges } = useMemo(
        () => createLayout(
            displayedNFA,
            activeStates,
            constructionSnapshot ? previousSnapshot : null
        ),
        [
            displayedNFA,
            activeStates,
            previousSnapshot
        ]
    );

    if (!displayedNFA) {
        return null;
    }

    return (
        <div className="graph-container">

            <div className="graph-heading">

                <h3>
                    {constructionSnapshot
                        ? "NFA Construction Animation"
                        : "NFA Visualization"}
                </h3>

                <span>
                    {displayedNFA.states.length} States
                </span>

            </div>

            {constructionSnapshot && (
                <div className="construction-info">

                    <strong>
                        Current construction stage
                    </strong>

                    <p>
                        Newly created states and transitions
                        are highlighted in yellow/orange.
                    </p>

                </div>
            )}

            <div className="graph-canvas">

                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    fitView
                    fitViewOptions={{
                        padding: 0.25,
                        minZoom: 0.2,
                        maxZoom: 1.5,
                    }}
                    minZoom={0.1}
                    maxZoom={2}
                    nodesDraggable={true}
                    nodesConnectable={false}
                    elementsSelectable={true}
                    proOptions={{
                        hideAttribution: false
                    }}
                >

                    <Background
                        gap={22}
                        size={1}
                        color="#dbe3ef"
                    />

                    <Controls />

                    <MiniMap
                        nodeStrokeWidth={3}
                        zoomable
                        pannable
                    />

                </ReactFlow>

            </div>

            <div className="graph-legend">

                <span>🔵 Start State</span>
                <span>🟢 Final State</span>
                <span>🟡 Active State</span>
                <span>🟠 Newly Added</span>
                <span>ε = Epsilon Transition</span>

            </div>

        </div>
    );
}
