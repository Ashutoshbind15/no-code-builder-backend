# Website Builder with SolidJS

A drag-and-drop website builder that uses a tree-based state management system with backend component registry, expansion, and **file generation**.

## Architecture

- **Backend**: Node.js API server with component registry, tree state management, and **JSX file generation**
- **Frontend**: SolidJS application that renders the generated component files
- **Component System**: Predefined components (card, button, text, etc.) expanded on the backend
- **File Generation**: Backend writes JSX files on every tree modification

## Features

- ✅ Tree-based state management
- ✅ Component registry with expansion
- ✅ Add/remove/update nodes
- ✅ Move nodes (drag-and-drop ready)
- ✅ Custom component definitions
- ✅ Backend-driven component expansion
- ✅ **File generation system** - writes JSX files on changes
- ✅ **Custom component files** - saved to usercomponents/
- ✅ API-driven architecture

## File Generation

The backend automatically generates JSX files when:
- Nodes are added/removed/updated
- Components are moved
- Custom components are registered

Generated files:
- `app/src/generated/GeneratedApp.jsx` - Main generated component
- `app/src/App.jsx` - Updated to import GeneratedApp
- `usercomponents/{componentName}.jsx` - Custom components

## API Endpoints

### Tree Operations
- `GET /api/tree` - Get current tree
- `POST /api/tree/init` - Initialize tree

### Node Operations
- `POST /api/node/add` - Add a node
- `DELETE /api/node/{nodeId}` - Remove a node
- `PUT /api/node/{nodeId}` - Update a node
- `POST /api/node/move` - Move a node

### Component Operations
- `GET /api/components` - Get available components
- `GET /api/components/{type}` - Get component definition
- `POST /api/components` - Register a new component

## Usage Examples

### Adding a Card Component
```javascript
await addNode({
    type: "card",
    props: [{
        name: "cardHeader",
        value: "My Card Title"
    }, {
        name: "cardFooter",
        value: "Card description"
    }, {
        name: "cardImage",
        value: "https://example.com/image.jpg"
    }]
});
```

### Adding a Button
```javascript
await addNode({
    type: "button",
    props: [{
        name: "text",
        value: "Click me!"
    }, {
        name: "className",
        value: "bg-blue-500 text-white px-4 py-2 rounded"
    }]
});
```

### Adding Native HTML Elements
```javascript
await addNode({
    type: "div",
    props: [{
        name: "className",
        value: "container mx-auto p-4"
    }]
});
```

## Component Definitions

Components are defined in `backend/componentRegistry.js` and include:

- **card**: Header, image, and footer
- **button**: Clickable button with text
- **text**: Paragraph text element
- **container**: Layout container
- **input**: Form input field

## Development

### Backend-Driven Development

The frontend **does not** include tree manipulation functions. All node operations are handled by the backend API:

1. **Use the API endpoints** for all tree modifications
2. **Use the test script** to see file generation in action:
   ```bash
   npm run test
   ```
3. **Backend generates files** automatically on all tree changes
4. **Frontend only renders** the generated files

### Testing the System

```bash
# Run the test script to see file generation
npm run test

# Files are generated in:
# - app/src/generated/GeneratedApp.jsx
# - usercomponents/customAlert.jsx

# Then build and serve to see results
npm run build:serve
```

## File Structure

```
├── backend/
│   ├── componentRegistry.js   # Component definitions
│   ├── websiteBuilderService.js # Tree management
│   ├── fileGenerator.js       # JSX file generation
│   └── testWebsiteBuilder.js  # Test script
├── app/
│   ├── src/
│   │   ├── generated/
│   │   │   └── GeneratedApp.jsx # Generated component (auto-created)
│   │   ├── store/
│   │   │   └── index.jsx # Will be later used to store dynamic frontend state
│   │   └── index.jsx            # Main app component (renders GeneratedApp)
├── componentregistry/         # Component implementations
└── usercomponents/            # Custom components (auto-generated)
```

## Next Steps

This system is ready for:
1. Drag-and-drop interface implementation
2. Property editor panels
3. Component library expansion
4. File generation and persistence

## Future Plans

[See detailed Future Plans & Roadmap](./FUTURE_PLANS.md)

- **Custom State Support**: Enable addition of custom state using SolidJS's global state management, leveraging fine-grained reactivity for efficient updates.
- **Fileserver as Docker Container**: Refactor the fileserver to run in a Docker container, supporting JavaScript generation, maintaining persistent connections, and serving content live.
- **Claude Code SDK Integration**: Add support for node-wise AI code edits using the Claude code SDK.
- **String Literal & Fragment Logic**: Improve the handling of string literals and fragment logic for more robust code generation and rendering.
- **Vite Build Optimization**: Further optimize Vite builds for faster development and production performance.
- **SSR & Routing**: Implement server-side rendering (SSR) and add routing capabilities for better SEO and navigation.
- **Event-Action Architecture**: Introduce an event-action architecture to enable more reactive and modular application logic.
- **Plugin Support**: Expand plugin support to include authentication, state stores, and CMS data integrations.
