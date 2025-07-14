// Backend component registry - handles component definitions and expansion
class ComponentRegistry {
    constructor() {
        this.components = {
            card: {
                nodeType: "card",
                props: [
                    {
                        name: "className",
                        type: "string",
                        initialValue: "bg-white rounded-lg shadow-md p-4"
                    },
                    {
                        name: "cardFooter",
                        type: "string",
                        initialValue: "Card Footer"
                    },
                    {
                        name: "cardHeader",
                        type: "string",
                        initialValue: "Card Header"
                    },
                    {
                        name: "cardImage",
                        type: "string",
                        initialValue: "https://via.placeholder.com/150"
                    }
                ],
                state: [],
                children: [
                    {
                        nodeType: "div",
                        props: [
                            {
                                name: "className",
                                type: "string",
                                initialValue: "font-bold text-lg mb-2"
                            }
                        ],
                        state: [],
                        children: [
                            {
                                nodeType: "stringLiteral",
                                value: "$cardHeader"
                            }
                        ]
                    },
                    {
                        nodeType: "img",
                        props: [
                            {
                                name: "src",
                                type: "string",
                                initialValue: "$cardImage"
                            },
                            {
                                name: "alt",
                                type: "string",
                                initialValue: "Card Image"
                            },
                            {
                                name: "className",
                                type: "string",
                                initialValue: "w-full h-48 object-cover rounded mb-4"
                            }
                        ],
                        state: [],
                        children: []
                    },
                    {
                        nodeType: "div",
                        props: [
                            {
                                name: "className",
                                type: "string",
                                initialValue: "text-gray-600"
                            }
                        ],
                        state: [],
                        children: [
                            {
                                nodeType: "stringLiteral",
                                value: "$cardFooter"
                            }
                        ]
                    }
                ]
            },

            button: {
                nodeType: "button",
                props: [
                    {
                        name: "className",
                        type: "string",
                        initialValue: "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    },
                    {
                        name: "text",
                        type: "string",
                        initialValue: "Click me"
                    },
                    {
                        name: "type",
                        type: "string",
                        initialValue: "button"
                    }
                ],
                state: [],
                children: [
                    {
                        nodeType: "stringLiteral",
                        value: "$text"
                    }
                ]
            },

            container: {
                nodeType: "container",
                props: [
                    {
                        name: "className",
                        type: "string",
                        initialValue: "max-w-4xl mx-auto p-4"
                    }
                ],
                state: [],
                children: []
            },

            text: {
                nodeType: "text",
                props: [
                    {
                        name: "className",
                        type: "string",
                        initialValue: "text-gray-900"
                    },
                    {
                        name: "content",
                        type: "string",
                        initialValue: "Sample text"
                    }
                ],
                state: [],
                children: [
                    {
                        nodeType: "stringLiteral",
                        value: "$content"
                    }
                ]
            },

            input: {
                nodeType: "input",
                props: [
                    {
                        name: "type",
                        type: "string",
                        initialValue: "text"
                    },
                    {
                        name: "placeholder",
                        type: "string",
                        initialValue: "Enter text..."
                    },
                    {
                        name: "className",
                        type: "string",
                        initialValue: "border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                    }
                ],
                state: [],
                children: []
            }
        };
    }

    // Generate unique node ID
    generateNodeId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Register a new component
    registerComponent(nodeType, componentDefinition) {
        this.components[nodeType] = componentDefinition;
    }

    // Get component definition
    getComponent(nodeType) {
        return this.components[nodeType];
    }

    // Get all available components
    getAvailableComponents() {
        return Object.keys(this.components);
    }
}

export default ComponentRegistry; 