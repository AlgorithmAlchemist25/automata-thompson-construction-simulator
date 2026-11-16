
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from regex_parser import infix_to_postfix
from thompson import ThompsonNFA
from simulator import simulate_string

app = FastAPI(title="Thompson Construction Simulator")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class RegexRequest(BaseModel):
    regex: str


class SimulationRequest(BaseModel):
    nfa: dict
    input_string: str


@app.get("/")
def home():
    return {"message": "Thompson Simulator API Running"}


@app.post("/api/construct")
def construct_nfa(request: RegexRequest):

    try:
        postfix = infix_to_postfix(request.regex)

        builder = ThompsonNFA()
        nfa = builder.build(postfix)

        return {
            "regex": request.regex,
            "postfix": postfix,
            "nfa": nfa
        }

    except (ValueError, IndexError) as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/api/simulate")
def simulate(request: SimulationRequest):

    try:
        result = simulate_string(
            request.nfa,
            request.input_string
        )

        return result

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
