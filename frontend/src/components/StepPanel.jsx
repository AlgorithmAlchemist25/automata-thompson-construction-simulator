
import {
    ChevronLeft,
    ChevronRight,
    RotateCcw,
    CheckCircle
} from "lucide-react";

export default function StepPanel({
    steps = [],
    currentStep = 0,
    onStepChange = () => {}
}) {

    if (!steps.length) {
        return <p>No construction steps available.</p>;
    }

    const step = steps[currentStep];

    const reset = () => {
        onStepChange(0);
    };

    return (
        <div className="steps-card">

            <div className="section-heading">
                <h3>Construction Steps</h3>
            </div>

            <div className="step-progress">
                Step {currentStep + 1} of {steps.length}
            </div>

            <div className="progress-track">
                <div
                    className="progress-fill"
                    style={{
                        width: `${((currentStep + 1) / steps.length) * 100}%`
                    }}
                />
            </div>

            <div className="step-content">

                <span className="step-number">
                    STEP {currentStep + 1}
                </span>

                <h4>{step.rule}</h4>

                <p>{step.description}</p>

                <div className="step-expression">
                    Operation: {step.expression}
                </div>

            </div>

            {/* Construction step list */}
            <div className="all-steps-list">

                <h4>All Construction Operations</h4>

                {steps.map((item, index) => (

                    <button
                        key={index}
                        className={`construction-step-item ${
                            index === currentStep ? "selected" : ""
                        } ${
                            index < currentStep ? "completed" : ""
                        }`}
                        onClick={() => onStepChange(index)}
                    >

                        <span className="operation-number">
                            {index < currentStep ? (
                                <CheckCircle size={17} />
                            ) : (
                                index + 1
                            )}
                        </span>

                        <span className="operation-details">
                            <strong>{item.rule}</strong>
                            <small>{item.expression}</small>
                        </span>

                    </button>

                ))}

            </div>

            {/* Navigation */}
            <div className="step-buttons">

                <button
                    className="secondary-btn"
                    disabled={currentStep === 0}
                    onClick={() => onStepChange(currentStep - 1)}
                >
                    <ChevronLeft size={17} />
                    Previous
                </button>

                <button
                    className="primary-btn"
                    disabled={currentStep === steps.length - 1}
                    onClick={() => onStepChange(currentStep + 1)}
                >
                    Next
                    <ChevronRight size={17} />
                </button>

            </div>

            <button className="reset-btn" onClick={reset}>
                <RotateCcw size={15} />
                Reset Steps
            </button>

        </div>
    );
}
