import { test, expect } from 'vitest';
import { addImports, modifier } from "../backend/transformjsx.js";
import { parse } from "@babel/parser";
import generate from '@babel/generator';

const code = `
import Mycomp from "./Mycomp"

const OtherComp = ({className}) => {
  return <div className={className}>OtherComp</div>
}

export default OtherComp
`

const codeWithCustomComponent = `
  import Mycomp from "./Mycomp"
  
  const OtherComp = ({className}) => {
    return <Mycomp className={className}>OtherComp</Mycomp>
  }

  export default OtherComp
`

test("test add imports", () => {

  const codeWithImports = `
    import TestComp from "./components/TestComp"
    import Mycomp from "./Mycomp"


    const OtherComp = ({className}) => {
      return <div className={className}>OtherComp</div>
    }

    export default OtherComp
  `

  const ast = parse(code, { sourceType: "module", plugins: ["jsx"] });
  const astWithImports = addImports(ast, "TestComp", "predefined");

  const expectedAst = parse(codeWithImports, { sourceType: "module", plugins: ["jsx"] });

  expect(generate(astWithImports).code).toBe(generate(expectedAst).code);
})

test("test add imports for user defined components", () => {
  const codeWithImports = `
  import TestComp from "./user-comps/TestComp"
    import Mycomp from "./Mycomp"
    

    const OtherComp = ({className}) => {
      return <div className={className}>OtherComp</div>
    }

    export default OtherComp
  `

  const ast = parse(code, { sourceType: "module", plugins: ["jsx"] });
  const astWithImports = addImports(ast, "TestComp", "userDefined");

  const expectedAst = parse(codeWithImports, { sourceType: "module", plugins: ["jsx"] });

  expect(generate(astWithImports).code).toBe(generate(expectedAst).code);
})

test("modifying component name", () => {
  const expectedCode = `
    import RenamedComp from "./RenamedComp"

    const OtherComp = ({className}) => {
      return <RenamedComp className={className}>OtherComp</RenamedComp>
    }

    export default OtherComp
  `

  const ast = parse(codeWithCustomComponent, { sourceType: "module", plugins: ["jsx"] });
  const astWithModifiedComponentName = modifier(ast, "Mycomp", "RenamedComp");

  const expectedAst = parse(expectedCode, { sourceType: "module", plugins: ["jsx"] });

  expect(generate(astWithModifiedComponentName).code).toBe(generate(expectedAst).code);
})