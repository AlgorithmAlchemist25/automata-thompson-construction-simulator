
def validate_regex(regex):
    """
    Validate the regular expression before converting it
    into postfix notation.
    """

    if not regex or not regex.strip():
        raise ValueError("Please enter a regular expression.")

    expression = "".join(regex.split())

    if not expression:
        raise ValueError("Please enter a regular expression.")

    expect_operand = True
    parentheses = 0

    for char in expression:

        # Basic symbols and epsilon
        if char.isalnum() or char == "ε":

            if not expect_operand:
                # Implicit concatenation is allowed.
                pass

            expect_operand = False

        elif char == "(":

            if not expect_operand:
                # Implicit concatenation before grouping is allowed.
                pass

            parentheses += 1
            expect_operand = True

        elif char == ")":

            if parentheses == 0:
                raise ValueError(
                    "Unexpected closing parenthesis ')'."
                )

            if expect_operand:
                raise ValueError(
                    "Empty parentheses or missing expression "
                    "before ')'."
                )

            parentheses -= 1
            expect_operand = False

        elif char == "|":

            if expect_operand:
                raise ValueError(
                    "Union operator '|' is missing an expression "
                    "before it."
                )

            expect_operand = True

        elif char == "*":

            if expect_operand:
                raise ValueError(
                    "Kleene Star '*' needs an expression before it."
                )

            expect_operand = False

        else:
            raise ValueError(
                f"Invalid character '{char}'. "
                "Use letters, digits, ε, |, *, and parentheses."
            )

    if parentheses > 0:
        raise ValueError(
            "Missing closing parenthesis ')'."
        )

    if expect_operand:
        raise ValueError(
            "The regular expression ends with an incomplete operator."
        )


def add_concat_operator(regex):

    expression = "".join(regex.split())

    result = ""

    for i, char in enumerate(expression):

        result += char

        if i == len(expression) - 1:
            continue

        next_char = expression[i + 1]

        left = (
            char.isalnum()
            or char == ")"
            or char == "*"
            or char == "ε"
        )

        right = (
            next_char.isalnum()
            or next_char == "("
            or next_char == "ε"
        )

        if left and right:
            result += "."

    return result


def infix_to_postfix(regex):

    # Validate before conversion
    validate_regex(regex)

    regex = add_concat_operator(regex)

    precedence = {
        "|": 1,
        ".": 2,
        "*": 3
    }

    output = []
    stack = []

    for char in regex:

        if char.isalnum() or char == "ε":

            output.append(char)

        elif char == "(":

            stack.append(char)

        elif char == ")":

            while stack and stack[-1] != "(":
                output.append(stack.pop())

            if not stack:
                raise ValueError(
                    "Unexpected closing parenthesis ')'."
                )

            stack.pop()

        elif char in precedence:

            if char == "*":
                output.append(char)
                continue

            while (
                stack
                and stack[-1] != "("
                and precedence[stack[-1]] >= precedence[char]
            ):
                output.append(stack.pop())

            stack.append(char)

        else:

            raise ValueError(
                f"Invalid character: {char}"
            )

    while stack:

        if stack[-1] == "(":
            raise ValueError(
                "Missing closing parenthesis ')'."
            )

        output.append(stack.pop())

    return "".join(output)
