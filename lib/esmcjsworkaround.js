import _traverse from "@babel/traverse";
import _generate from "@babel/generator";

export const traverse = typeof _traverse === "function" ? _traverse : _traverse.default;
export const generate = typeof _generate === "function" ? _generate : _generate.default;