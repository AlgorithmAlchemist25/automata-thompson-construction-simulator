
export default function TransitionTable({ nfa }) {

    return (
        <div className="table-card">

            <div className="section-heading">
                <h3>NFA Transition Table</h3>
            </div>

            <div className="table-responsive">

                <table className="transition-table">

                    <thead>
                        <tr>
                            <th>From State</th>
                            <th>Symbol</th>
                            <th>To State</th>
                        </tr>
                    </thead>

                    <tbody>
                        {nfa.transitions.map((transition, index) => (
                            <tr key={index}>
                                <td>q{transition.from}</td>
                                <td>
                                    <span className={
                                        transition.symbol === "ε"
                                            ? "epsilon-label"
                                            : "symbol-label"
                                    }>
                                        {transition.symbol}
                                    </span>
                                </td>
                                <td>q{transition.to}</td>
                            </tr>
                        ))}
                    </tbody>

                </table>

            </div>

        </div>
    );
}
