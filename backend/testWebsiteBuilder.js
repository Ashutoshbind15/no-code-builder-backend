#!/usr/bin/env node

import WebsiteBuilderService from './websiteBuilderService.js';

const websiteBuilder = new WebsiteBuilderService();

async function runTests() {
    console.log('🚀 Testing Website Builder with File Generation\n');

    try {
        // Initialize the tree
        console.log('1. Initializing tree...');
        await websiteBuilder.initTree();
        console.log('✅ Tree initialized and files generated\n');

        // Add a section
        console.log('2. Adding a section...');
        const sectionId = await websiteBuilder.addNode({
            type: "section",
            props: [{
                name: "className",
                value: "flex w-full py-2 px-4 bg-gray-100 min-h-screen"
            }]
        });
        console.log(`✅ Section added with ID: ${sectionId}\n`);

        // Add a card component
        console.log('3. Adding a card component...');
        const cardId = await websiteBuilder.addNode({
            type: "card",
            props: [{
                name: "cardHeader",
                value: "Welcome to Website Builder"
            }, {
                name: "cardFooter",
                value: "Built with SolidJS and File Generation"
            }, {
                name: "cardImage",
                value: "https://via.placeholder.com/300x200"
            }]
        }, sectionId);
        console.log(`✅ Card added with ID: ${cardId}\n`);

        // Add a button
        console.log('4. Adding a button...');
        const buttonId = await websiteBuilder.addNode({
            type: "button",
            props: [{
                name: "className",
                value: "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            }],
            children: [{
                nodeType: "stringLiteral",
                value: "Click me!"
            }]
        }, sectionId);
        console.log(`✅ Button added with ID: ${buttonId}\n`);

        // Add a text element
        console.log('5. Adding a text element...');
        const textId = await websiteBuilder.addNode({
            type: "text",
            props: [{
                name: "className",
                value: "text-lg text-gray-800 mt-4"
            }],
            children: [{
                nodeType: "stringLiteral",
                value: "This is a dynamically generated text element!"
            }]
        }, sectionId);
        console.log(`✅ Text added with ID: ${textId}\n`);

        // Add a container with children
        console.log('6. Adding a container with children...');
        const containerId = await websiteBuilder.addNode({
            type: "container",
            props: [{
                name: "className",
                value: "max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-lg"
            }]
        }, sectionId);
        console.log(`✅ Container added with ID: ${containerId}\n`);

        // Add a button inside the container
        console.log('7. Adding a button inside the container...');
        const containerButtonId = await websiteBuilder.addNode({
            type: "button",
            props: [{
                name: "className",
                value: "bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
            }],
            children: [{
                nodeType: "stringLiteral",
                value: "Container Button"
            }]
        }, containerId);
        console.log(`✅ Button added inside container with ID: ${containerButtonId}\n`);

        // Add another text inside the container
        console.log('8. Adding text inside the container...');
        const containerTextId = await websiteBuilder.addNode({
            type: "text",
            props: [{
                name: "className",
                value: "text-gray-600 ml-4"
            }],
            children: [{
                nodeType: "stringLiteral",
                value: "This text is inside the container!"
            }]
        }, containerId);
        console.log(`✅ Text added inside container with ID: ${containerTextId}\n`);

        // Register a custom component
        console.log('9. Registering a custom component...');
        await websiteBuilder.registerComponent("customAlert", {
            nodeType: "customAlert",
            props: [{
                name: "message",
                type: "string",
                initialValue: "Alert message"
            }, {
                name: "type",
                type: "string",
                initialValue: "info"
            }],
            state: [],
            children: [{
                nodeType: "div",
                props: [{
                    name: "className",
                    type: "string",
                    initialValue: "alert alert-info p-4 rounded bg-blue-100 text-blue-800"
                }],
                state: [],
                children: [{
                    nodeType: "stringLiteral",
                    value: "$message"
                }]
            }]
        });
        console.log('✅ Custom component registered and saved to usercomponents/\n');

        // Update a node
        console.log('10. Updating the card component...');
        await websiteBuilder.updateNode(cardId, {
            props: [{
                name: "cardHeader",
                value: "Updated Card Title"
            }, {
                name: "cardFooter",
                value: "This card has been updated!"
            }, {
                name: "cardImage",
                value: "https://via.placeholder.com/300x200"
            }]
        });
        console.log('✅ Card updated and files regenerated\n');

        // Get current tree
        console.log('11. Current tree structure:');
        const tree = websiteBuilder.getTree();
        console.log(JSON.stringify(tree, null, 2));

        console.log('\n🎉 All tests completed successfully!');
        console.log('\n📁 Generated files:');
        console.log('   - app/src/generated/GeneratedApp.jsx');
        console.log('   - app/src/App.jsx (updated)');
        console.log('   - usercomponents/customAlert.jsx');
        console.log('\n🚀 You can now build and serve the frontend to see the results!');

    } catch (error) {
        console.error('❌ Test failed:', error);
        process.exit(1);
    }
}

// Run the tests
runTests(); 