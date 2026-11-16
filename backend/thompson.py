
from dataclasses import dataclass


@dataclass
class Fragment:
    start: int
    end: int


class ThompsonNFA:

    def __init__(self):
        self.states = []
        self.transitions = []
        self.next_state = 0
        self.steps = []

    def new_state(self):
        state = self.next_state
        self.next_state += 1
        self.states.append(state)
        return state

    def add_transition(self, start, end, symbol):
        self.transitions.append({
            "from": start,
            "to": end,
            "symbol": symbol
        })

    # Save the NFA after every construction operation
    def save_step(self, rule, expression, description, fragment):

        snapshot = {
            "states": self.states.copy(),
            "transitions": [t.copy() for t in self.transitions],
            "start_state": fragment.start,
            "accept_state": fragment.end
        }

        self.steps.append({
            "rule": rule,
            "expression": expression,
            "description": description,
            "snapshot": snapshot
        })

    def build(self, postfix):

        stack = []

        for char in postfix:

            # RULE 1: Basic Symbol
            if char.isalnum():

                start = self.new_state()
                end = self.new_state()

                self.add_transition(start, end, char)

                fragment = Fragment(start, end)
                stack.append(fragment)

                self.save_step(
                    "Basic Symbol",
                    char,
                    f"Created transition {start} --{char}--> {end}",
                    fragment
                )

            # Empty string
            elif char == 'ε':

                start = self.new_state()
                end = self.new_state()

                self.add_transition(start, end, 'ε')

                fragment = Fragment(start, end)
                stack.append(fragment)

                self.save_step(
                    "Epsilon",
                    "ε",
                    "Created an epsilon transition",
                    fragment
                )

            # RULE 2: Union
            elif char == '|':

                if len(stack) < 2:
                    raise ValueError("Invalid union expression")

                b = stack.pop()
                a = stack.pop()

                start = self.new_state()
                end = self.new_state()

                self.add_transition(start, a.start, 'ε')
                self.add_transition(start, b.start, 'ε')

                self.add_transition(a.end, end, 'ε')
                self.add_transition(b.end, end, 'ε')

                fragment = Fragment(start, end)
                stack.append(fragment)

                self.save_step(
                    "Union",
                    "|",
                    f"Combined two NFAs using new states {start} and {end}",
                    fragment
                )

            # RULE 3: Concatenation
            elif char == '.':

                if len(stack) < 2:
                    raise ValueError("Invalid concatenation expression")

                b = stack.pop()
                a = stack.pop()

                self.add_transition(a.end, b.start, 'ε')

                fragment = Fragment(a.start, b.end)
                stack.append(fragment)

                self.save_step(
                    "Concatenation",
                    ".",
                    f"Connected state {a.end} to state {b.start} using epsilon",
                    fragment
                )

            # RULE 4: Kleene Star
            elif char == '*':

                if not stack:
                    raise ValueError("Invalid Kleene Star expression")

                a = stack.pop()

                start = self.new_state()
                end = self.new_state()

                self.add_transition(start, a.start, 'ε')
                self.add_transition(start, end, 'ε')

                self.add_transition(a.end, a.start, 'ε')
                self.add_transition(a.end, end, 'ε')

                fragment = Fragment(start, end)
                stack.append(fragment)

                self.save_step(
                    "Kleene Star",
                    "*",
                    f"Added repetition and empty-string paths using states {start} and {end}",
                    fragment
                )

            else:
                raise ValueError(f"Invalid postfix symbol: {char}")

        if len(stack) != 1:
            raise ValueError("Invalid regular expression")

        final_fragment = stack.pop()

        return {
            "states": self.states.copy(),
            "transitions": [t.copy() for t in self.transitions],
            "start_state": final_fragment.start,
            "accept_state": final_fragment.end,
            "steps": self.steps
        }
