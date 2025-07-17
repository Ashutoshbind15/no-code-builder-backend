import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import generate from "@babel/generator";
import * as t from "@babel/types";

const code = `
  export default function App() {
    return <Button id="1" onClick={() => {}}>Click</Button>;
  }
`;

const ast = parse(code, { sourceType: "module", plugins: ["jsx"] });

const modifier = (ast) => {
    traverse.default(ast, {
        JSXOpeningElement(path) {

            // console.log(path.node.type)
            // console.log(path.node)

            if (t.isJSXIdentifier(path.node.name, { name: "Button" })) {
                path.node.name = t.JSXIdentifier("LoggedButton");
            }
        },

        JSXClosingElement(path) {
            console.log("Closing:", path.node.name);
            if (t.isJSXIdentifier(path.node.name, { name: "Button" })) {
                path.node.name = t.JSXIdentifier("LoggedButton");
            }
        }
    });

    return ast;
}

const addImports = (ast, componentName, componentType) => {

    if (componentType === "predefined") {

        traverse.default(ast, {
            Program(path) {
                path.node.body.unshift(
                    t.importDeclaration([
                        t.importDefaultSpecifier(t.identifier(componentName))
                    ], t.stringLiteral("./components"))
                );
            }
        });

        return ast;
    } else if (componentType === "userDefined") {
        traverse.default(ast, {
            Program(path) {
                path.node.body.unshift(
                    t.importDeclaration([
                        t.importDefaultSpecifier(t.identifier(componentName))
                    ], t.stringLiteral("./user-comps"))
                );
            }
        });

        return ast;
    }
}


// todo: remember that the impl is not yet complete, handle cases for duplicate attrs, and support literals and expressions for attr vals as well
const addOrModifyAttributes = (ast, componentName, nodeId, attributeName, attributeValue) => {
    traverse.default(ast, {
        JSXOpeningElement(path) {
            if (t.isJSXIdentifier(path.node.name, { name: componentName })) {
                path.node.attributes.push(t.JSXAttribute(t.JSXIdentifier(attributeName), t.stringLiteral(attributeValue)));
            }
        }
    });

    return ast;
}

const { code: out } = generate.default(addOrModifyAttributes(ast, "Button", "1", "onClick", "doStuff"));

console.log(out);