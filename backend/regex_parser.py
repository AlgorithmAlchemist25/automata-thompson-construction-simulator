
def add_concat_operator(regex):
    result = ""

    for i in range(len(regex)):
        c1 = regex[i]

        if c1.isspace():
            continue

        result += c1

        # Find the next non-space character
        j = i + 1
        while j < len(regex) and regex[j].isspace():
            j += 1

        if j == len(regex):
            continue

        c2 = regex[j]

        # If first character can end an expression
        left = c1.isalnum() or c1 == ')' or c1 == '*' or c1 == 'ε'

        # If second character can start an expression
        right = c2.isalnum() or c2 == '(' or c2 == 'ε'

        if left and right:
            result += '.'

    return result


def infix_to_postfix(regex):
    regex = add_concat_operator(regex)

    precedence = {
        '|': 1,
        '.': 2,
        '*': 3
    }

    output = []
    stack = []

    for char in regex:

        if char.isalnum() or char == 'ε':
            output.append(char)

        elif char == '(':
            stack.append(char)

        elif char == ')':
            while stack and stack[-1] != '(':
                output.append(stack.pop())

            if not stack:
                raise ValueError("Mismatched parentheses")

            stack.pop()

        elif char in precedence:

            if char == '*':
                output.append(char)
                continue

            while (
                stack and stack[-1] != '('
                and precedence[stack[-1]] >= precedence[char]
            ):
                output.append(stack.pop())

            stack.append(char)

        else:
            raise ValueError(f"Invalid character: {char}")

    while stack:
        if stack[-1] == '(':
            raise ValueError("Mismatched parentheses")

        output.append(stack.pop())

    return ''.join(output)
