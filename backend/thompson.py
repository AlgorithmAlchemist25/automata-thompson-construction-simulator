
from dataclasses import dataclass, field


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

    def build(self, postfix):

        stack = []

        for char in postfix:

            # RULE 1: Basic symbol
            if char.isalnum():

                start = self.new_state()
                end = self.new_state()

                self.add_transition(start, end, char)

                stack.append(Fragment(start, end))

                self.steps.append({
                    "rule": "Basic Symbol",
                    "expression": char,
                    "description": f"Created transition {start} --{char}--> {end}"
                })

            # Empty string
            elif char == 'ε':

                start = self.new_state()
                end = self.new_state()

                self.add_transition(start, end, 'ε')

                stack.append(Fragment(start, end))

                self.steps.append({
                    "rule": "Epsilon",
                    "expression": "ε",
                    "description": "Created an epsilon transition"
                })

            # RULE 2: Union
            elif char == '|':

                b = stack.pop()
                a = stack.pop()

                start = self.new_state()
                end = self.new_state()

                self.add_transition(start, a.start, 'ε')
                self.add_transition(start, b.start, 'ε')

                self.add_transition(a.end, end, 'ε')
                self.add_transition(b.end, end, 'ε')

                stack.append(Fragment(start, end))

                self.steps.append({
                    "rule": "Union",
                    "expression": "|",
                    "description": f"Combined two NFAs using new states {start} and {end}"
                })

            # RULE 3: Concatenation
            elif char == '.':

                b = stack.pop()
                a = stack.pop()

                self.add_transition(a.end, b.start, 'ε')

                stack.append(Fragment(a.start, b.end))

                self.steps.append({
                    "rule": "Concatenation",
                    "expression": ".",
                    "description": f"Connected state {a.end} to state {b.start} using epsilon"
                })

            # RULE 4: Kleene Star
            elif char == '*':

                a = stack.pop()

                start = self.new_state()
                end = self.new_state()

                self.add_transition(start, a.start, 'ε')
                self.add_transition(start, end, 'ε')

                self.add_transition(a.end, a.start, 'ε')
                self.add_transition(a.end, end, 'ε')

                stack.append(Fragment(start, end))

                self.steps.append({
                    "rule": "Kleene Star",
                    "expression": "*",
                    "description": f"Added repetition and empty-string paths using states {start} and {end}"
                })

            else:
                raise ValueError(f"Invalid postfix symbol: {char}")

        if len(stack) != 1:
            raise ValueError("Invalid regular expression")

        final_fragment = stack.pop()

        return {
            "states": self.states,
            "transitions": self.transitions,
            "start_state": final_fragment.start,
            "accept_state": final_fragment.end,
            "steps": self.steps
        }
