
def epsilon_closure(states, transitions):

    closure = set(states)
    stack = list(states)

    while stack:

        current = stack.pop()

        for t in transitions:

            if (
                t["from"] == current
                and t["symbol"] == "ε"
                and t["to"] not in closure
            ):

                closure.add(t["to"])
                stack.append(t["to"])

    return closure


def simulate_string(nfa, input_string):

    transitions = nfa["transitions"]

    current_states = epsilon_closure(
        {nfa["start_state"]},
        transitions
    )

    execution_steps = [{
        "position": 0,
        "symbol": "START",
        "active_states": sorted(current_states)
    }]

    for index, char in enumerate(input_string):

        next_states = set()

        for state in current_states:

            for t in transitions:

                if (
                    t["from"] == state
                    and t["symbol"] == char
                ):
                    next_states.add(t["to"])

        current_states = epsilon_closure(
            next_states,
            transitions
        )

        execution_steps.append({
            "position": index + 1,
            "symbol": char,
            "active_states": sorted(current_states)
        })

    accepted = nfa["accept_state"] in current_states

    return {
        "accepted": accepted,
        "result": "Accepted" if accepted else "Rejected",
        "execution_steps": execution_steps,
        "final_states": sorted(current_states)
    }
