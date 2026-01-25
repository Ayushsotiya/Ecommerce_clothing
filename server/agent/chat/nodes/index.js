/**
 * Nodes Index
 * Exports all agent nodes
 */

const { supervisorNode, routeByIntent } = require('./supervisor');
const { productSearchNode } = require('./productSearch');
const { orderManagementNode } = require('./orderManagement');
const { responseGeneratorNode } = require('./responseGenerator');

module.exports = {
    supervisorNode,
    routeByIntent,
    productSearchNode,
    orderManagementNode,
    responseGeneratorNode
};
