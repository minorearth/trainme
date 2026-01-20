export const ast = ({code, nm, param, type}) => { return `import ast


def has_decorator(parsed_ast, nm):
    for node in ast.walk(parsed_ast):
        if isinstance(node, ast.FunctionDef):
            for decorator in node.decorator_list:
                if isinstance(decorator, ast.Name) and decorator.id == nm:
                    return True
                elif isinstance(decorator, ast.Call) and isinstance(decorator.func,
                                                                    ast.Name) and decorator.func.id == nm:
                    return True
    return False


def has_named_args(tree):
    for node in ast.walk(tree):
        if isinstance(node, ast.Call):
            if node.keywords:
                for kw in node.keywords:
                    if kw.arg is not None:
                        return True
            if hasattr(node, 'keywords'):
                for keyword in node.keywords:
                    if keyword.arg is None and hasattr(keyword, 'value'):
                        return True
            if hasattr(node, 'kwargs') and node.kwargs:
                return True
            if hasattr(node, 'starargs') and node.starargs:
                return True
    return False


def import_spec_ent(tree, nm, param):
    for node in ast.walk(tree):
        if isinstance(node, ast.ImportFrom):
            if node.module == nm:
                if any(param == alias.name for alias in node.names):
                    return True
    return False


def has_operation(node, op_type):
    if isinstance(node, ast.BinOp):
        if isinstance(node.op, op_type):
            return True
    for child in ast.iter_child_nodes(node):
        if has_operation(child, op_type):
            return True
    return False


def has_bool_operation(tree, op_type):
    found = False

    class OpVisitor(ast.NodeVisitor):
        def visit_BoolOp(self, node):
            nonlocal found
            if isinstance(node.op, op_type):
                found = True
            self.generic_visit(node)

    OpVisitor().visit(tree)
    return found


def has_unary_operation(tree, op_type):
    found = False

    class OpVisitor(ast.NodeVisitor):
        def visit_UnaryOp(self, node):
            nonlocal found
            if isinstance(node.op, op_type):
                found = True
            self.generic_visit(node)

    OpVisitor().visit(tree)
    return found


def has_operation_common(node, nm):
    if nm == 'add':
        return has_operation(node, ast.Add)
    if nm == 'sub':
        return has_operation(node, ast.Sub)
    if nm == 'mult':
        return has_operation(node, ast.Mult)
    if nm == 'div':
        return has_operation(node, ast.Div)
    if nm == 'pow':
        return has_operation(node, ast.Pow)
    if nm == 'mod':
        return has_operation(node, ast.Mod)
    if nm == 'floorDiv':
        return has_operation(node, ast.FloorDiv)
    if nm == 'or':
        return has_bool_operation(node, ast.Or)
    if nm == 'and':
        return has_bool_operation(node, ast.And)
    if nm == 'not':
        return has_unary_operation(node, ast.Not)


def has_subscript_index_usage(node):
    if isinstance(node, ast.Subscript):
        if not isinstance(node.slice, ast.Slice):
            return True
    for child in ast.iter_child_nodes(node):
        if has_subscript_index_usage(child):
            return True
    return False


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


def findMethod(parsed, nm):
    for node in ast.walk(parsed):
        if isinstance(node, ast.Call) and isinstance(node.func, ast.Attribute) and node.func.attr == nm:
            return True
    return findFunction(parsed, nm, '')


def findFunction(code, nm, funcParam):
    class FunctionFinder(ast.NodeVisitor):
        def __init__(self):
            self.found = False
            self.assignments = {}  # отслеживаем дополнительные назначения

        def visit_Assign(self, node):
            if isinstance(node.value, ast.Name) and node.value.id == nm:
                for target in node.targets:
                    if isinstance(target, ast.Name):
                        self.assignments[target.id] = nm
            self.generic_visit(node)

        def isInAss(self, func_name, nm):
            return func_name == nm or (func_name in self.assignments and self.assignments[func_name] == nm)

        def visit_Call(self, node):
            func_name = None
            if isinstance(node.func, ast.Name):
                func_name = node.func.id
                if any([self.isInAss(arg.id, nm) for arg in node.args if isinstance(arg, ast.Name)]):
                    self.found = True
            elif isinstance(node.func, ast.Attribute):
                pass
            if self.isInAss(func_name, nm):
                if funcParam == '':
                    self.found = True
                else:
                    for kw in node.keywords:
                        if kw.arg == funcParam:
                            self.found = True
            self.generic_visit(node)

    tree = ast.parse(code)
    finder = FunctionFinder()
    finder.visit(tree)
    return finder.found


def find_for_in_not_range(parsed):
    nm2 = getattr(ast, 'For')
    for node in ast.walk(parsed):
        if isinstance(node, nm2):
            return not (isinstance(node.iter, ast.Call))
    return False


def find_Compare(parsed, nm):
    nm2 = getattr(ast, nm)
    for node in ast.walk(parsed):
        if isinstance(node, ast.Compare):
            if any(isinstance(op, nm2) for op in node.ops):
                return True
    return False


def findPythonEntity(parsed, nm, param=''):
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


def findDict(parsed, nm, param):
    for node in ast.walk(parsed):
        if isinstance(node, ast.Dict):
            return True
    return findFunction(parsed, nm, param)


def findImport(parsed, module_name=None):
    for node in ast.walk(parsed):
        if isinstance(node, ast.Import):
            if module_name is None:
                return True
            for alias in node.names:
                if alias.name == module_name:
                    return True
        elif isinstance(node, ast.ImportFrom):
            if module_name is None:
                return True
            if node.module == module_name:
                return True
    return False


def ifin(tree):
    contains_in_condition = False
    for node in ast.walk(tree):
        if isinstance(node, ast.If):
            def contains_in_operator(test_node):
                if isinstance(test_node, ast.Compare):
                    if any(isinstance(op, (ast.In, ast.NotIn)) for op in test_node.ops):
                        return True
                elif isinstance(test_node, ast.BoolOp):
                    return any(contains_in_operator(val) for val in test_node.values)
                elif isinstance(test_node, ast.UnaryOp):
                    return contains_in_operator(test_node.operand)
                return False

            if contains_in_operator(node.test):
                contains_in_condition = True
                break
    return contains_in_condition


def parse(code, nm, param, type):
    parsed = ast.parse(code)
    if type == 'method':
        return findMethod(parsed, nm)
    elif type == 'function':
        return findFunction(parsed, nm, param)
    elif type == 'operation':
        return has_operation_common(parsed, nm)
    elif type == 'node':
        return findPythonEntity(parsed, nm)
    elif type == 'recursion':
        return is_recursive(parsed)
    elif type == 'index':
        return has_subscript_index_usage(parsed)
    elif type == 'find_for_in_not_range':
        return find_for_in_not_range(parsed)
    elif type == 'forelse':
        return contains_for_else(parsed)
    elif type == 'starincall':
        return contains_star_in_call(parsed)
    elif type == 'unpackass':
        return detect_unpacking_ass(parsed)
    elif type == 'ifin':
        return ifin(parsed)
    elif type == 'import':
        return findImport(parsed)
    elif type == 'compare':
        return find_Compare(parsed, nm)
    elif type == 'importspec':
        return import_spec_ent(parsed, nm, param)
    elif type == 'dict':
        return findDict(parsed, 'dict', param)
    elif type == 'importmodule':
        return findImport(parsed, nm)
    elif type == 'namedargs':
        return has_named_args(parsed)
    elif type == 'decorator':
        return has_decorator(parsed, nm)
    return False
 
print(parse("${code}", "${nm}", "${param}", "${type}"))`;};