export const ast = ({ code, nm, param, type }) => {
  return `
import ast
def parse(code, nm, param, type):
    parsed = ast.parse(code)
    if type == 'node' or type=='op':
        nm = getattr(ast, nm)
    for node in ast.walk(parsed):
        if type == 'method':
            if isinstance(node, ast.Call) and isinstance(node.func, ast.Attribute) and node.func.attr == nm:
                return True
        elif type == 'function':
            if 'print(k(map(int,s)))' in code and isinstance(node, ast.Call) and isinstance(node.func, ast.Name):
                print(parsed,node,node.func.id )
            if isinstance(node, ast.Call) and isinstance(node.func, ast.Name) and node.func.id == nm:
                if param != '':
                    for kw in node.keywords:
                        if kw.arg == param:
                            return True
                else:
                    return True
        elif type == 'node':
            if isinstance(node, nm):
                if param == '':
                    return True
                else:
                    if param == 'forinnotrange':
                        return not (isinstance(node.iter, ast.Call))
                    else:
                        for kw in node.keywords:
                            if kw.arg == param:
                                return True
        elif type=='op':
            if isinstance(node, ast.BinOp) and isinstance(node.op, nm):
                return True

    return False
print(parse("${code}", "${nm}", "${param}", "${type}"))
`;
};
