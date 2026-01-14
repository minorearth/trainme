export const ast = ({ code, nm, param, type }) => {
  return `
import ast
def detect_unpacking_ass(node):
    if isinstance(node, ast.Assign):
        for target in node.targets:
            if isinstance(target, (ast.Tuple, ast.List)):
                return True
    for child in ast.iter_child_nodes(node):
        if detect_unpacking_ass(child):
            return True
    return False

def contains_for_else(source_code):
    tree = ast.parse(source_code)
    for node in ast.walk(tree):
        if isinstance(node, ast.For):
            if node.orelse:
                return True
    return False

def contains_star_in_call(node):
    if isinstance(node, ast.Call):
        if isinstance(node.func, ast.Name):
            for arg in node.args:
                if isinstance(arg, ast.Starred):
                    return True
    for child in ast.iter_child_nodes(node):
        if contains_star_in_call(child):
            return True
    return False

def is_recursive(parsed):
    tree = parsed
    func_node = None
    for node in ast.iter_child_nodes(tree):
        if isinstance(node, ast.FunctionDef):
            func_node = node
            break
    if func_node is None:
        return False
    func_name = func_node.name
    class RecursionVisitor(ast.NodeVisitor):
        def __init__(self):
            self.is_recursive = False
        def visit_Call(self, node):
            if isinstance(node.func, ast.Name):
                if node.func.id == func_name:
                    self.is_recursive = True
            self.generic_visit(node)

    visitor = RecursionVisitor()
    visitor.visit(func_node)
    return visitor.is_recursive

def findMethod(parsed,nm):
    for node in ast.walk(parsed):
            if isinstance(node, ast.Call) and isinstance(node.func, ast.Attribute) and node.func.attr == nm:
                return True
    return False

def findFunction(parsed,funcName,funcParam):
    for node in ast.walk(parsed):
        if isinstance(node, ast.Call) and isinstance(node.func, ast.Name) and node.func.id == funcName:
            if funcParam != '':
                for kw in node.keywords:
                    if kw.arg == funcParam:
                        return True
            else:
                return True
    return False

def find_for_in_not_range(parsed):
    nm2 = getattr(ast, 'For')
    for node in ast.walk(parsed):
        if isinstance(node, nm2):
            return not (isinstance(node.iter, ast.Call))
    return False

def findPythonEntity(parsed,nm,param=''):
    nm2 = getattr(ast, nm)
    for node in ast.walk(parsed):
        if isinstance(node, nm2):
            if param == '':
                return True
            # else:
            #     for kw in node.keywords:
            #         if kw.arg == param:
            #             return True
    return False

def parse(code, nm, param, type):
    parsed = ast.parse(code)
    if type == 'method':
        return findMethod(parsed,nm)
    elif type == 'function':
        return findFunction(parsed, nm, param)
    elif type == 'node':
        return findPythonEntity(parsed, nm)
    elif type == 'recursion':
        return is_recursive(parsed)
    elif type == 'find_for_in_not_range':
        return find_for_in_not_range(parsed)
    elif type == 'forelse':
        return contains_for_else(parsed)
    elif type =='starincall':
        return contains_star_in_call(parsed)
    elif type =='unpackass':
        return detect_unpacking_ass(parsed)
    return False
print(parse("${code}", "${nm}", "${param}", "${type}"))
`;
};
