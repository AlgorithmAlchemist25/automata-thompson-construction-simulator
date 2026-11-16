
import { useState, useEffect } from "react";

import RegexInput from "../components/RegexInput";
import NFAGraph from "../components/NFAGraph";
import StepPanel from "../components/StepPanel";
import StringTester from "../components/StringTester";
import TransitionTable from "../components/TransitionTable";

export default function Simulator() {

    const [response, setResponse] = useState(null);
    const [activeStates, setActiveStates] = useState([]);

    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const handleNFAReceived = (data) => {
        setResponse(data);
        setActiveStates([]);
        setCurrentStep(0);
        setIsPlaying(false);
    };

    const nfa = response?.nfa;
    const steps = nfa?.steps || [];

    const currentSnapshot = steps[currentStep]?.snapshot || null;

    const previousSnapshot =
        currentStep > 0
            ? steps[currentStep - 1]?.snapshot || null
            : null;

    useEffect(() => {

        if (!isPlaying || steps.length === 0) {
            return;
        }

        if (currentStep >= steps.length - 1) {
            setIsPlaying(false);
            return;
        }

        const timer = setTimeout(() => {
            setCurrentStep((previous) => previous + 1);
            setActiveStates([]);
        }, 1200);

        return () => clearTimeout(timer);

    }, [isPlaying, currentStep, steps.length]);

    const handlePrevious = () => {
        setIsPlaying(false);
        setActiveStates([]);
        setCurrentStep((previous) => Math.max(0, previous - 1));
    };

    const handleNext = () => {
        setIsPlaying(false);
        setActiveStates([]);
        setCurrentStep((previous) =>
            Math.min(steps.length - 1, previous + 1)
        );
    };

    const handleReset = () => {
        setIsPlaying(false);
        setActiveStates([]);
        setCurrentStep(0);
    };

    const handlePlayPause = () => {
        if (currentStep >= steps.length - 1) {
            setCurrentStep(0);
        }

        setIsPlaying((previous) => !previous);
    };

    return (
        <div className="app-container">

            <header className="app-header">
                <div>
                    <h1>Thompson's Construction</h1>
                    <p>
                        Interactive Regular Expression to
                        Epsilon-NFA Simulator
                    </p>
                </div>

                <span className="header-badge">
                    AUTOMATA THEORY
                </span>
            </header>

            <main className="dashboard">

                {/* TOP SECTION: INPUT LEFT, GRAPH RIGHT */}

                <div className="top-layout">

                    <section className="input-column">
                        <RegexInput
                            onNFAReceived={handleNFAReceived}
                        />

                        {response && nfa && (
                            <div className="stats-grid">

                                <div className="stat-card">
                                    <span>Total States</span>
                                    <h2>{nfa.states.length}</h2>
                                </div>

                                <div className="stat-card">
                                    <span>Total Transitions</span>
                                    <h2>{nfa.transitions.length}</h2>
                                </div>

                                <div className="stat-card">
                                    <span>Start State</span>
                                    <h2>q{nfa.start_state}</h2>
                                </div>

                                <div className="stat-card">
                                    <span>Final State</span>
                                    <h2>q{nfa.accept_state}</h2>
                                </div>

                            </div>
                        )}
                    </section>

                    <section className="visual-column">

                        {response && nfa ? (
                            <NFAGraph
                                nfa={nfa}
                                activeStates={activeStates}
                                constructionSnapshot={currentSnapshot}
                                previousSnapshot={previousSnapshot}
                            />
                        ) : (
                            <div className="welcome-card">
                                <h2>Welcome to the NFA Simulator</h2>
                                <p>
                                    Enter a regular expression in the
                                    input panel to construct its equivalent
                                    epsilon-NFA.
                                </p>
                                <div className="example-regex">
                                    Example: (a|b)*abb
                                </div>
                            </div>
                        )}

                    </section>

                </div>

                {/* LOWER SECTION: ANIMATION AND STEPS */}

                {response && nfa && (
                    <>

                        <div className="lower-layout">

                            <section className="animation-column">

                                {steps.length > 0 && (
                                    <div className="construction-animation">

                                        <div className="animation-header">
                                            <div>
                                                <h2>
                                                    Thompson Construction Animation
                                                </h2>
                                                <p>
                                                    Watch how the NFA is
                                                    constructed step by step.
                                                </p>
                                            </div>

                                            <span className="step-counter">
                                                Step {currentStep + 1} / {steps.length}
                                            </span>
                                        </div>

                                        <div className="progress-track">
                                            <div
                                                className="progress-fill"
                                                style={{
                                                    width: `${((currentStep + 1) / steps.length) * 100}%`
                                                }}
                                            />
                                        </div>

                                        <div className="current-step-card">
                                            <span className="step-rule">
                                                {steps[currentStep]?.rule}
                                            </span>

                                            <h3>
                                                Expression:{" "}
                                                {steps[currentStep]?.expression}
                                            </h3>

                                            <p>
                                                {steps[currentStep]?.description}
                                            </p>
                                        </div>

                                        <div className="animation-controls">

                                            <button
                                                onClick={handleReset}
                                                className="animation-btn secondary"
                                            >
                                                ↺ Reset
                                            </button>

                                            <button
                                                onClick={handlePrevious}
                                                disabled={currentStep === 0}
                                                className="animation-btn secondary"
                                            >
                                                ◀ Previous
                                            </button>

                                            <button
                                                onClick={handlePlayPause}
                                                className="animation-btn primary"
                                            >
                                                {isPlaying ? "⏸ Pause" : "▶ Play"}
                                            </button>

                                            <button
                                                onClick={handleNext}
                                                disabled={currentStep === steps.length - 1}
                                                className="animation-btn secondary"
                                            >
                                                Next ▶
                                            </button>

                                        </div>

                                    </div>
                                )}

                            </section>

                            <aside className="steps-column">
                                <StepPanel
                                    steps={steps}
                                    currentStep={currentStep}
                                    onStepChange={(step) => {
                                        setIsPlaying(false);
                                        setActiveStates([]);
                                        setCurrentStep(step);
                                    }}
                                />
                            </aside>

                        </div>

                        {/* STRING TESTING AND TRANSITION TABLE */}

                        <div className="tools-layout">

                            <section className="tool-column">
                                <StringTester
                                    nfa={nfa}
                                    onActiveStatesChange={setActiveStates}
                                />
                            </section>

                            <section className="tool-column">
                                <TransitionTable nfa={nfa} />
                            </section>

                        </div>

                    </>
                )}

            </main>

            <footer>
                Thompson's Construction Simulator | Automata Theory Project
            </footer>

        </div>
    );
}
