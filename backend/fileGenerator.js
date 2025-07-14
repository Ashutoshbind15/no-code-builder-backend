import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class FileGenerator {
    constructor() {
        this.outputDir = join(__dirname, '../app/src/generated');
        this.userComponentsDir = join(__dirname, '../usercomponents');
        this.ensureDirectories();
    }

    ensureDirectories() {
        if (!existsSync(this.outputDir)) {
            mkdirSync(this.outputDir, { recursive: true });
        }
        if (!existsSync(this.userComponentsDir)) {
            mkdirSync(this.userComponentsDir, { recursive: true });
        }
    }

    // Check if a tag is a custom component (not HTML)
    isCustomComponent(type) {
        if (!type) return false;

        // First check if it's defined in the ComponentRegistry
        // We need to access the registry somehow... for now, let's use a different approach
        // Check if it's one of the known custom components
        const customComponents = ['card', 'button', 'text', 'container', 'input', 'icon', 'imagecontainer'];

        if (customComponents.includes(type.toLowerCase())) {
            return true;
        }

        const htmlTags = [
            'div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'section', 'article', 'nav', 'aside', 'header', 'footer',
            'img', 'form', 'label', 'select', 'option',
            'textarea', 'ul', 'ol', 'li', 'table', 'tr', 'td', 'th',
            'br', 'hr', 'a', 'strong', 'em', 'code', 'pre'
        ];

        // Special types that should not be treated as custom components
        const specialTypes = ['fragment', 'stringLiteral'];

        return !htmlTags.includes(type.toLowerCase()) && !specialTypes.includes(type);
    }

    // Check if a component takes children (not self-closing)
    componentTakesChildren(type) {
        const componentsWithChildren = ['container'];
        return componentsWithChildren.includes(type.toLowerCase());
    }

    // Generate JSX code for a node
    generateNodeJSX(node, depth = 0) {
        const indent = '  '.repeat(depth);

        if (!node) return '';

        const { nodeId, type, props, children } = node;

        // Handle stringLiteral nodes
        if (type === 'stringLiteral') {
            const value = node.value;
            if (typeof value === 'string' && value.startsWith('$')) {
                const propName = value.substring(1);
                return `{${propName}}`;
            }
            return value;
        }

        // Handle fragment nodes
        if (type === 'fragment') {
            if (!children || children.length === 0) return '';
            return children.map(child => this.generateNodeJSX(child, depth)).join('\n');
        }

        // For custom components, handle special prop conversion
        if (this.isCustomComponent(type)) {
            let finalProps = [...(props || [])];

            // Convert stringLiteral children to appropriate props for non-container components
            if (children && children.length > 0 && !this.componentTakesChildren(type)) {
                children.forEach(child => {
                    if (child.type === 'stringLiteral' || child.nodeType === 'stringLiteral') {
                        const value = child.value;

                        // Convert to appropriate prop based on component type
                        if (type === 'button') {
                            finalProps.push({
                                name: 'text',
                                value: value,
                                type: 'string'
                            });
                        } else if (type === 'text') {
                            finalProps.push({
                                name: 'content',
                                value: value,
                                type: 'string'
                            });
                        }
                    }
                });
            }

            const propsJSX = this.generatePropsJSX(finalProps);
            const componentName = type.charAt(0).toUpperCase() + type.slice(1);

            // If component takes children, render with opening/closing tags
            if (this.componentTakesChildren(type)) {
                let jsx = `${indent}<${componentName}${propsJSX}>`;

                // Render children for components that take them
                if (children && children.length > 0) {
                    const childrenJSX = children.map(child => {
                        const childJSX = this.generateNodeJSX(child, depth + 1);
                        return childJSX ? `${childJSX}` : '';
                    }).filter(Boolean).join('\n');

                    if (childrenJSX.trim()) {
                        jsx += `\n${childrenJSX}\n${indent}`;
                    }
                }

                jsx += `</${componentName}>`;
                return jsx;
            } else {
                // Self-closing for components that don't take children
                return `${indent}<${componentName}${propsJSX} />`;
            }
        }

        // Convert props array to JSX attributes
        const propsJSX = this.generatePropsJSX(props);

        // Capitalize component name if it's a custom component
        const componentName = this.isCustomComponent(type)
            ? type.charAt(0).toUpperCase() + type.slice(1)
            : type;

        // Handle self-closing tags
        if (this.isSelfClosing(type)) {
            return `${indent}<${componentName}${propsJSX} />`;
        }

        // Handle opening tag for HTML elements
        let jsx = `${indent}<${componentName}${propsJSX}>`;

        // Handle children for HTML elements only
        if (children && children.length > 0) {
            const childrenJSX = children.map(child => {
                const childJSX = this.generateNodeJSX(child, depth + 1);
                return childJSX ? `${childJSX}` : '';
            }).filter(Boolean).join('\n');

            if (childrenJSX.trim()) {
                jsx += `\n${childrenJSX}\n${indent}`;
            }
        }

        // Handle closing tag for HTML elements
        jsx += `</${componentName}>`;

        return jsx;
    }

    // Generate JSX props from props array
    generatePropsJSX(props) {
        if (!props || props.length === 0) return '';

        return props.map(prop => {
            const value = prop.value || prop.initialValue;

            // Skip undefined values
            if (value === undefined || value === null) {
                return '';
            }

            // Handle different prop types
            if (prop.type === 'string') {
                return ` ${prop.name}="${value}"`;
            } else if (prop.type === 'boolean') {
                return value ? ` ${prop.name}` : '';
            } else if (prop.type === 'number') {
                return ` ${prop.name}={${value}}`;
            } else {
                // Default to string
                return ` ${prop.name}="${value}"`;
            }
        }).join('');
    }

    // Check if tag is self-closing
    isSelfClosing(type) {
        if (!type) return false;

        const selfClosingTags = ['img', 'input', 'br', 'hr', 'meta', 'link'];
        return selfClosingTags.includes(type.toLowerCase());
    }

    // Generate import statements for components
    generateImports(tree) {
        const componentImports = new Map(); // Map to track components and their source directories

        const collectComponents = (node) => {
            if (!node) return;

            if (this.isCustomComponent(node.type)) {
                // Determine the import source based on component type
                const isBuiltIn = ['card', 'button', 'text', 'container', 'input', 'icon', 'imagecontainer'].includes(node.type.toLowerCase());
                const importSource = isBuiltIn ? 'componentregistry' : 'usercomponents';
                componentImports.set(node.type, importSource);
            }

            if (node.children) {
                node.children.forEach(collectComponents);
            }
        };

        collectComponents(tree.root);

        let importStatements = '';
        componentImports.forEach((source, component) => {
            const capitalizedName = component.charAt(0).toUpperCase() + component.slice(1);
            importStatements += `import { ${capitalizedName} } from "../../../${source}/${component}.jsx";\n`;
        });

        return importStatements;
    }

    // Generate the main GeneratedApp component
    generateMainComponent(tree) {
        const imports = this.generateImports(tree);
        const jsx = this.generateNodeJSX(tree.root);

        const component = `${imports}
export default function GeneratedApp() {
    return (
        <div>
${jsx}
        </div>
    );
}`;

        return component;
    }

    // Write the generated component to file
    writeGeneratedApp(tree) {
        const componentCode = this.generateMainComponent(tree);
        const filePath = join(this.outputDir, 'GeneratedApp.jsx');

        try {
            writeFileSync(filePath, componentCode, 'utf8');
            console.log('✅ Generated app component written to:', filePath);
        } catch (error) {
            console.error('❌ Error writing generated app:', error);
            throw error;
        }
    }

    // Write a custom component to usercomponents directory
    writeCustomComponent(nodeType, componentDefinition) {
        const componentCode = this.generateCustomComponent(nodeType, componentDefinition);
        const filePath = join(this.userComponentsDir, `${nodeType}.jsx`);

        try {
            writeFileSync(filePath, componentCode, 'utf8');
            console.log('✅ Custom component written to:', filePath);
        } catch (error) {
            console.error('❌ Error writing custom component:', error);
            throw error;
        }
    }

    // Generate custom component code
    generateCustomComponent(nodeType, componentDefinition) {
        const capitalizedName = nodeType.charAt(0).toUpperCase() + nodeType.slice(1);

        // Extract prop names for function signature
        const propNames = componentDefinition.props.map(prop => prop.name);
        const propsSignature = propNames.length > 0 ? `{ ${propNames.join(', ')} }` : '';

        // Generate the JSX structure for custom components
        const jsx = this.generateCustomComponentJSX(componentDefinition, 1, nodeType);

        const component = `export function ${capitalizedName}(${propsSignature}) {
    return (
${jsx}
    );
}`;

        return component;
    }

    // Generate JSX specifically for custom components (handles variable substitution)
    generateCustomComponentJSX(node, depth = 0, rootComponentType = null) {
        const indent = '  '.repeat(depth);

        if (!node) return '';

        const { nodeType, type, props, children } = node;

        // Handle stringLiteral nodes with variable substitution
        if (nodeType === 'stringLiteral' || type === 'stringLiteral') {
            const value = node.value;
            if (typeof value === 'string' && value.startsWith('$')) {
                const propName = value.substring(1);
                return `{${propName}}`;
            }
            return value;
        }

        // Handle fragment nodes
        if (nodeType === 'fragment' || type === 'fragment') {
            if (!children || children.length === 0) return '';
            return children.map(child => this.generateCustomComponentJSX(child, depth, rootComponentType)).join('\n');
        }

        // For the root component definition, render its children directly
        if (depth === 1 && rootComponentType && (nodeType === rootComponentType || type === rootComponentType)) {
            // This is the root component definition - render its children
            if (!children || children.length === 0) return '';
            return children.map(child => this.generateCustomComponentJSX(child, depth, rootComponentType)).join('\n');
        }

        // Get the actual node type
        const actualType = nodeType || type;

        // Convert props array to JSX attributes for custom components
        const propsJSX = this.generateCustomComponentPropsJSX(props);

        // Handle self-closing tags
        if (this.isSelfClosing(actualType)) {
            return `${indent}<${actualType}${propsJSX} />`;
        }

        // Handle opening tag
        let jsx = `${indent}<${actualType}${propsJSX}>`;

        // Handle children
        if (children && children.length > 0) {
            const childrenJSX = children.map(child => {
                const childJSX = this.generateCustomComponentJSX(child, depth + 1, rootComponentType);
                return childJSX ? `${childJSX}` : '';
            }).filter(Boolean).join('\n');

            if (childrenJSX.trim()) {
                jsx += `\n${childrenJSX}\n${indent}`;
            }
        }

        // Handle closing tag
        jsx += `</${actualType}>`;

        return jsx;
    }

    // Generate JSX props for custom components (handles variable substitution)
    generateCustomComponentPropsJSX(props) {
        if (!props || props.length === 0) return '';

        return props.map(prop => {
            const value = prop.value || prop.initialValue;

            // Handle variable substitution
            if (typeof value === 'string' && value.startsWith('$')) {
                const propName = value.substring(1);
                return ` ${prop.name}={${propName}}`;
            }

            // Handle different prop types
            if (prop.type === 'string') {
                return ` ${prop.name}="${value}"`;
            } else if (prop.type === 'boolean') {
                return value ? ` ${prop.name}` : '';
            } else if (prop.type === 'number') {
                return ` ${prop.name}={${value}}`;
            } else {
                // Default to string
                return ` ${prop.name}="${value}"`;
            }
        }).join('');
    }
}

export default FileGenerator; 