
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Construct NFA from regular expression
export const constructNFA = async (regex) => {
  const response = await API.post("/api/construct", {
    regex: regex,
  });

  return response.data;
};

// Simulate the NFA with an input string
export const simulateNFA = async (nfa, inputString) => {
  const response = await API.post("/api/simulate", {
    nfa: nfa,
    input_string: inputString,
  });

  return response.data;
};

export default API;
