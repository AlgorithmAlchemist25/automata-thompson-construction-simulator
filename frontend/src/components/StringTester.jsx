
import { useState, useEffect } from "react";
import { simulateNFA } from "../services/api";
import {
    Play,
    ChevronLeft,
    ChevronRight,
    RotateCcw
} from "lucide-react";

export default function StringTester({
    nfa,
    onActiveStatesChange
}) {

    const [input, setInput] = useState("");
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");
    const [stepIndex, setStepIndex] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setResult(null);
        setStepIndex(0);
        onActiveStatesChange([]);
    }, [nfa]);

    const testString = async () => {

        try {
            setLoading(true);
            setError("");
            setResult(null);
            setStepIndex(0);

            onActiveStatesChange([]);

            const data = await simulateNFA(nfa, input);

            setResult(data);

            if (data.execution_steps?.length) {
                onActiveStatesChange(
                    data.execution_steps[0].active_states
                );
            }

        } catch (err) {
            setError(
                err.response?.data?.detail ||
                "Simulation failed."
            );
        } finally {
            setLoading(false);
        }
    };

    const changeStep = (index) => {

        if (!result) return;

        const steps = result.execution_steps;

        if (index < 0 || index >= steps.length) return;

        setStepIndex(index);

        onActiveStatesChange(
            steps[index].active_states
        );
    };

    const reset = () => {
        setResult(null);
        setStepIndex(0);
        onActiveStatesChange([]);
        setError("");
    };

    const currentStep = result?.execution_steps?.[stepIndex];

    return (
        <div className="tester-card">

            <div className="section-heading">
                <h3>String Simulator</h3>
            </div>

            <p className="muted">
                Enter a string to check whether it is
                accepted by the generated NFA.
            </p>

            <div className="tester-controls">

                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter string, e.g. aabb"
                    onKeyDown={(e) => {
                        if (e.key === "Enter") testString();
                    }}
                />

                <button
                    className="primary-btn"
                    onClick={testString}
                    disabled={loading}
                >
                    <Play size={16} />
                    {loading ? "Testing..." : "Test String"}
                </button>

            </div>

            {error && (
                <p className="error-message">{error}</p>
            )}

            {result && (
                <div className="simulation-result">

                    <div className={
                        result.accepted
                            ? "result-success"
                            : "result-failure"
                    }>
                        {result.accepted
                            ? "✓ String Accepted"
                            : "✕ String Rejected"}
                    </div>

                    <p>
                        Final active states: {
                            result.final_states.join(", ") || "None"
                        }
                    </p>

                    <div className="simulation-navigation">

                        <h4>Simulation Execution</h4>

                        <p>
                            Step {stepIndex + 1} of {
                                result.execution_steps.length
                            }
                        </p>

                        {currentStep && (
                            <div className="simulation-step">
                                <p>
                                    Character: <strong>
                                        {currentStep.symbol === "START"
                                            ? "Initial"
                                            : currentStep.symbol}
                                    </strong>
                                </p>

                                <p>
                                    Active states: <strong>
                                        {currentStep.active_states.join(", ") || "None"}
                                    </strong>
                                </p>
                            </div>
                        )}

                        <div className="step-buttons">

                            <button
                                className="secondary-btn"
                                disabled={stepIndex === 0}
                                onClick={() => changeStep(stepIndex - 1)}
                            >
                                <ChevronLeft size={16} />
                                Previous
                            </button>

                            <button
                                className="primary-btn"
                                disabled={
                                    stepIndex ===
                                    result.execution_steps.length - 1
                                }
                                onClick={() => changeStep(stepIndex + 1)}
                            >
                                Next
                                <ChevronRight size={16} />
                            </button>

                        </div>

                        <button
                            className="reset-btn"
                            onClick={reset}
                        >
                            <RotateCcw size={15} />
                            Reset Simulation
                        </button>

                    </div>

                </div>
            )}

        </div>
    );
}
