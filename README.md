
# Thompson's Construction Simulator

An interactive web-based application that converts Regular Expressions into Equivalent Epsilon-NFAs using Thompson's Construction Algorithm.

## About the Project

Thompson's Construction Simulator is an educational tool developed to help students understand how regular expressions are converted into Non-deterministic Finite Automata with epsilon transitions.

The application provides step-by-step visualization of NFA construction and allows users to test whether input strings are accepted or rejected by the generated automaton.

## Features

- Regular Expression input
- Regular Expression validation
- Infix to Postfix conversion
- Thompson's Construction Algorithm
- Epsilon-NFA generation
- Interactive NFA graph visualization
- Step-by-step construction animation
- Previous, Next, Play, Pause and Reset controls
- String acceptance and rejection simulation
- NFA transition table
- Total states and transitions display
- Start state and final state identification
- Dark-themed user interface

## Technologies Used

### Frontend
- React.js
- Vite
- JavaScript
- CSS
- Bootstrap
- React Flow

### Backend
- Python
- FastAPI

## Project Structure

automata-thompson-construction-simulator/
|
|-- backend/
|   |-- main.py
|   |-- regex_parser.py
|   |-- simulator.py
|   |-- thompson.py
|   |-- requirements.txt
|
|-- frontend/
|   |-- public/
|   |-- src/
|       |-- components/
|       |-- pages/
|       |-- services/
|       |-- App.jsx
|       |-- App.css
|       |-- main.jsx
|   |-- package.json
|
|-- .gitignore
|-- README.md

## Installation and Setup

### 1. Clone the Repository

git clone https://github.com/AlgorithmAlchemist25/automata-thompson-construction-simulator.git

### 2. Open the Project Folder

cd automata-thompson-construction-simulator

### 3. Backend Setup

Open a terminal and run:

cd backend

Create a virtual environment:

python -m venv .venv

Activate it on Windows:

.venv\Scripts\activate

Install dependencies:

pip install -r requirements.txt

Start the backend server:

uvicorn main:app --reload

Backend URL:

http://127.0.0.1:8000

API documentation:

http://127.0.0.1:8000/docs

### 4. Frontend Setup

Open a second terminal from the project root:

cd frontend

Install dependencies:

npm install

Start the frontend:

npm run dev

Open the local URL displayed in your terminal, usually:

http://localhost:5173

## How to Use

1. Start the backend and frontend servers.
2. Open the application in your browser.
3. Enter a regular expression.
4. Click the Construct NFA button.
5. View the generated epsilon-NFA graph.
6. Explore the construction steps using animation controls.
7. Enter a string to test whether it is accepted or rejected.
8. View the generated transition table.

## Example

Regular Expression:

(a|b)*abb

The application constructs an equivalent epsilon-NFA using Thompson's Construction Algorithm.

## Applications

- Automata Theory education
- Understanding regular expressions
- Learning finite automata
- Visualizing Thompson's Construction
- Testing string acceptance using an NFA

## Future Enhancements

- DFA conversion using subset construction
- DFA minimization
- Exporting automata diagrams
- More advanced visualization controls

## Author

AlgorithmAlchemist25

## License

This project is developed for educational purposes.
