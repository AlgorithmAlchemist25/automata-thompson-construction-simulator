
import { useState } from "react";
import { constructNFA } from "../services/api";
import { Regex } from "lucide-react";

export default function RegexInput({ onNFAReceived }) {
    const [regex, setRegex] = useState("(a|b)*abb");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleConstruct = async () => {
        if (!regex.trim()) {
            setError("Please enter a regular expression.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const data = await constructNFA(regex);

            onNFAReceived(data);

        } catch (err) {
            setError(
                err.response?.data?.detail ||
                "Unable to construct NFA. Check your backend."
            );

            onNFAReceived(null);

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="regex-card">

            <div className="section-heading">
                <Regex size={20} />
                <h3>Regular Expression</h3>
            </div>

            <p className="muted">
                Enter a regular expression to construct
                its equivalent epsilon-NFA.
            </p>

            <div className="regex-controls">

                <input
                    type="text"
                    value={regex}
                    onChange={(e) => setRegex(e.target.value)}
                    placeholder="Example: (a|b)*abb"
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleConstruct();
                        }
                    }}
                />

                <button
                    className="primary-btn"
                    onClick={handleConstruct}
                    disabled={loading}
                >
                    {loading ? "Constructing..." : "Construct NFA"}
                </button>

            </div>

            {error && (
                <p className="error-message">{error}</p>
            )}

            <div className="operator-help">
                <span>| = Union </span>
                <span> * = Kleene Star </span>
                <span> ε = Epsilon </span>
                <span> () = Grouping </span>
            </div>

        </div>
    );
}
