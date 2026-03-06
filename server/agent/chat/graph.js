/**
 * LangGraph Agent Graph Definition
 * Defines the multi-agent workflow for e-commerce communication
 */

const { StateGraph, END } = require('@langchain/langgraph');
const { Annotation } = require('@langchain/langgraph');

const {
    supervisorNode,
    routeByIntent,
    productSearchNode,
    orderManagementNode,
    responseGeneratorNode,
    negotiationNode
} = require('./nodes');

/**
 * State annotation for LangGraph
 * Defines the state schema and reducers
 */
const AgentStateAnnotation = Annotation.Root({
    messages: Annotation({
        reducer: (current, update) => {
            if (!update) return current;
            return [...(current || []), ...(Array.isArray(update) ? update : [update])];
        },
        default: () => []
    }),
    userId: Annotation({
        reducer: (_, update) => update,
        default: () => null
    }),
    currentIntent: Annotation({
        reducer: (_, update) => update,
        default: () => null
    }),
    toolResults: Annotation({
        reducer: (current, update) => {
            if (!update) return current;
            return [...(current || []), ...(Array.isArray(update) ? update : [update])];
        },
        default: () => []
    }),
    tokenCount: Annotation({
        reducer: (current, update) => (current || 0) + (update || 0),
        default: () => 0
    }),
    error: Annotation({
        reducer: (_, update) => update,
        default: () => null
    }),
    finalResponse: Annotation({
        reducer: (_, update) => update,
        default: () => null
    }),
    negotiationData: Annotation({
        reducer: (current, update) => {
            // Merge update into current, or return update if current is null
            if (!current) return update;
            if (!update) return current;
            return { ...current, ...update };
        },
        default: () => null
    })
});

/**
 * Build the agent graph
 * @returns {CompiledGraph}
 */
const buildAgentGraph = () => {
    // Create the graph with state annotation
    const workflow = new StateGraph(AgentStateAnnotation);

    // Add nodes
    workflow.addNode("supervisor", supervisorNode);
    workflow.addNode("productSearch", productSearchNode);
    workflow.addNode("orderManagement", orderManagementNode);
    workflow.addNode("negotiation", negotiationNode);
    workflow.addNode("responseGenerator", responseGeneratorNode);

    // Set entry point
    workflow.setEntryPoint("supervisor");

    // Add conditional edges from supervisor
    workflow.addConditionalEdges(
        "supervisor",
        routeByIntent,
        {
            "productSearch": "productSearch",
            "orderManagement": "orderManagement",
            "negotiation": "negotiation",
            "responseGenerator": "responseGenerator"
        }
    );

    // Add edges from specialist nodes to response generator
    workflow.addEdge("productSearch", "responseGenerator");
    workflow.addEdge("orderManagement", "responseGenerator");
    workflow.addEdge("negotiation", "responseGenerator");

    // Add edge from response generator to END
    workflow.addEdge("responseGenerator", END);

    // Compile the graph
    return workflow.compile();
};

// Create a singleton instance
let compiledGraph = null;

/**
 * Get the compiled agent graph (lazy initialization)
 * @returns {CompiledGraph}
 */
const getAgentGraph = () => {
    if (!compiledGraph) {
        compiledGraph = buildAgentGraph();
        console.log('[Agent] Graph compiled successfully');
    }
    return compiledGraph;
};

module.exports = {
    buildAgentGraph,
    getAgentGraph,
    AgentStateAnnotation
};
