import { traverse } from "../lib/esmcjsworkaround.js";
import * as t from "@babel/types";

export const modifier = (ast, currentName, newName) => {
    traverse(ast, {
        JSXOpeningElement(path) {
            if (t.isJSXIdentifier(path.node.name, { name: currentName })) {
                path.node.name = t.JSXIdentifier(newName);
            }
        },

        JSXClosingElement(path) {
            if (t.isJSXIdentifier(path.node.name, { name: currentName })) {
                path.node.name = t.JSXIdentifier(newName);
            }
        },

        ImportDeclaration(path) {
            if (path.node.specifiers[0].type === "ImportDefaultSpecifier") {
                console.log("ImportDefaultSpecifier");
                console.log(path.node.source.value);
                const newSpecifier = t.importDefaultSpecifier(t.identifier(newName));
                path.node.specifiers = [newSpecifier];

            } else {
                // here we assume that the import is a named import
                // todo: currently just supporting renaming of the default components, extend it later
            }

            const source = path.node.source;

            path.node.source.value = `./${newName}`;
        }
    });

    return ast;
}

export const addImports = (ast, componentName, componentType) => {

    if (componentType === "predefined") {

        traverse(ast, {
            Program(path) {
                path.node.body.unshift(
                    t.importDeclaration([
                        t.importDefaultSpecifier(t.identifier(componentName))
                    ], t.stringLiteral(`./components/${componentName}`))
                );
            }
        });

        return ast;
    } else if (componentType === "userDefined") {
        traverse(ast, {
            Program(path) {
                path.node.body.unshift(
                    t.importDeclaration([
                        t.importDefaultSpecifier(t.identifier(componentName))
                    ], t.stringLiteral(`./user-comps/${componentName}`))
                );
            }
        });

        return ast;
    }
}


// todo: remember that the impl is not yet complete, handle cases for duplicate attrs, and support literals and expressions for attr vals as well
const addOrModifyAttributes = (ast, componentName, nodeId, attributeName, attributeValue) => {
    traverse(ast, {
        JSXOpeningElement(path) {
            if (t.isJSXIdentifier(path.node.name, { name: componentName })) {
                path.node.attributes.push(t.JSXAttribute(t.JSXIdentifier(attributeName), t.stringLiteral(attributeValue)));
            }
        }
    });

    return ast;
}