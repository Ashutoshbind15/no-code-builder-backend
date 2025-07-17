import ComponentRegistry from './componentRegistry.js';
import FileGenerator from './fileGenerator.js';

class WebsiteBuilderService {
    constructor() {
        this.componentRegistry = new ComponentRegistry();
        this.fileGenerator = new FileGenerator();
        this.websiteTree = {
            root: {
                nodeId: "root",
                type: "fragment",
                props: [],
                state: [],
                children: []
            }
        };
    }

    // Initialize the tree with a basic structure
    initTree() {
        this.websiteTree = {
            root: {
                nodeId: "root",
                type: "fragment",
                props: [],
                state: [],
                children: []
            }
        };

        // Generate initial files
        this.fileGenerator.writeGeneratedApp(this.websiteTree);

        return this.websiteTree;
    }

    // Find a node by ID in the tree
    findNodeById(tree, nodeId) {
        if (tree.nodeId === nodeId) {
            return tree;
        }

        if (tree.children) {
            for (const child of tree.children) {
                const found = this.findNodeById(child, nodeId);
                if (found) return found;
            }
        }

        return null;
    }

    // Add a node to the tree (with component expansion)
    addNode(nodeData, parentId = "root") {
        // Generate nodeId if not provided
        if (!nodeData.nodeId) {
            nodeData.nodeId = this.componentRegistry.generateNodeId();
        }

        // Find parent node
        const parentNode = this.findNodeById(this.websiteTree.root, parentId);
        if (!parentNode) {
            throw new Error(`Parent node with ID ${parentId} not found`);
        }

        // Add node to parent's children
        if (!parentNode.children) {
            parentNode.children = [];
        }

        // Use the node data directly - don't expand custom components
        // since we have proper React components
        let finalNode = nodeData;

        parentNode.children.push(finalNode);

        // Generate updated files

        // Todo: dont write every time, also account for the fact that addition or any change in that matter,
        // could be either just a node addition to a parent node that supports children,
        // or it could be a change to a node that is a custom component, i.e. looks good but ensure we allow structureal changes as well

        // also, we currently, rerender the whole app, which is not efficient,
        this.fileGenerator.writeGeneratedApp(this.websiteTree);

        return finalNode.nodeId;
    }

    // Remove a node from the tree
    removeNode(nodeId) {
        // Recursive function to remove node from parent's children
        const removeFromParent = (parent) => {
            if (parent.children) {
                const index = parent.children.findIndex(child => child.nodeId === nodeId);
                if (index !== -1) {
                    parent.children.splice(index, 1);
                    return true;
                }

                // Search in children
                for (const child of parent.children) {
                    if (removeFromParent(child)) {
                        return true;
                    }
                }
            }
            return false;
        };

        const removed = removeFromParent(this.websiteTree.root);

        if (removed) {
            // Generate updated files
            this.fileGenerator.writeGeneratedApp(this.websiteTree);
        }

        return removed;
    }

    // Update a node's properties
    updateNode(nodeId, updates) {
        const node = this.findNodeById(this.websiteTree.root, nodeId);

        if (!node) {
            throw new Error(`Node with ID ${nodeId} not found`);
        }

        // Apply updates to the node
        Object.keys(updates).forEach(key => {
            node[key] = updates[key];
        });

        // Generate updated files
        this.fileGenerator.writeGeneratedApp(this.websiteTree);

        return node;
    }

    // Get the current tree structure
    getTree() {
        return this.websiteTree;
    }

    // Register a new component
    registerComponent(nodeType, componentDefinition) {
        this.componentRegistry.registerComponent(nodeType, componentDefinition);

        // Write custom component to usercomponents directory
        this.fileGenerator.writeCustomComponent(nodeType, componentDefinition);
    }

    // Get available components
    getAvailableComponents() {
        return this.componentRegistry.getAvailableComponents();
    }

    // Get component definition
    getComponentDefinition(nodeType) {
        return this.componentRegistry.getComponent(nodeType);
    }

    // Move a node (remove from old position and add to new position)
    moveNode(nodeId, newParentId, position = -1) {
        // First, find and remove the node
        const node = this.findNodeById(this.websiteTree.root, nodeId);
        if (!node) {
            throw new Error(`Node with ID ${nodeId} not found`);
        }

        // Store the node data before removal
        const nodeData = { ...node };

        // Remove from current position (without generating files)
        const removeFromParent = (parent) => {
            if (parent.children) {
                const index = parent.children.findIndex(child => child.nodeId === nodeId);
                if (index !== -1) {
                    parent.children.splice(index, 1);
                    return true;
                }

                // Search in children
                for (const child of parent.children) {
                    if (removeFromParent(child)) {
                        return true;
                    }
                }
            }
            return false;
        };

        if (!removeFromParent(this.websiteTree.root)) {
            throw new Error(`Failed to remove node with ID ${nodeId}`);
        }

        // Add to new position
        const newParent = this.findNodeById(this.websiteTree.root, newParentId);
        if (!newParent) {
            throw new Error(`Parent node with ID ${newParentId} not found`);
        }

        if (!newParent.children) {
            newParent.children = [];
        }

        if (position === -1 || position >= newParent.children.length) {
            newParent.children.push(nodeData);
        } else {
            newParent.children.splice(position, 0, nodeData);
        }

        // Generate updated files
        this.fileGenerator.writeGeneratedApp(this.websiteTree);

        return nodeData.nodeId;
    }

    // Serialize tree to JSON
    serializeTree() {
        return JSON.stringify(this.websiteTree, null, 2);
    }

    // Load tree from JSON
    loadTree(jsonData) {
        try {
            this.websiteTree = JSON.parse(jsonData);
            return this.websiteTree;
        } catch (error) {
            throw new Error(`Failed to load tree: ${error.message}`);
        }
    }
}

export default WebsiteBuilderService; 