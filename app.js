/**********************************************
 * STARTER CODE
 **********************************************/

/**
 * shuffle()
 * Shuffle the contents of an array
 *   depending the datatype of the source
 * Makes a copy. Does NOT shuffle the original.
 * Based on Steve Griffith's array shuffle prototype
 * @Parameters: Array or string
 * @Return: Scrambled Array or string, based on the provided parameter
 */
function shuffle (src) {
  const copy = [...src]

  const length = copy.length
  for (let i = 0; i < length; i++) {
    const x = copy[i]
    const y = Math.floor(Math.random() * length)
    const z = copy[y]
    copy[i] = z
    copy[y] = x
  }

  if (typeof src === 'string') {
    return copy.join('')
  }

  return copy
}

/**********************************************
 * YOUR CODE BELOW
 **********************************************/
const { useState, useEffect } = React;

const planets = ["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"];



const generateScrambledPlanets = (planets) => planets.map(planet => mixUp(planet));

function PlanetScramble() {
  const [scrambledPlanets, setScrambledPlanets] = useState([]);
  const [currentPlanetIndex, setCurrentPlanetIndex] = useState(0);
  const [inputGuess, setInputGuess] = useState('');
  const [score, setScore] = useState(0);
  const [strikes, setStrikes] = useState(0);
  const [remainingPasses, setRemainingPasses] = useState(3);

  useEffect(() => {
    const savedState = JSON.parse(localStorage.getItem('planetScrambleState'));
    if (savedState) {
      setScrambledPlanets(savedState.scrambledPlanets);
      setCurrentPlanetIndex(savedState.currentPlanetIndex);
      setScore(savedState.score);
      setStrikes(savedState.strikes);
      setRemainingPasses(savedState.remainingPasses);
    } else {
      const scrambled = generateScrambledPlanets(planets);
      setScrambledPlanets(scrambled);
    }
  }, []);

  useEffect(() => {
    const gameState = {
      scrambledPlanets,
      currentPlanetIndex,
      score,
      strikes,
      remainingPasses,
    };
    localStorage.setItem('planetScrambleState', JSON.stringify(gameState));
  }, [scrambledPlanets, currentPlanetIndex, score, strikes, remainingPasses]);

  const handleGuess = (e) => {
    e.preventDefault();
    if (inputGuess.toLowerCase() === planets[currentPlanetIndex].toLowerCase()) {
      setScore(score + 1);
      setCurrentPlanetIndex(currentPlanetIndex + 1);
    } else {
      setStrikes(strikes + 1);
    }
    setInputGuess('');
  };

  const handleSkip = () => {
    if (remainingPasses > 0) {
      setRemainingPasses(remainingPasses - 1);
      setCurrentPlanetIndex(currentPlanetIndex + 1);
    }
  };

  const handleRestart = () => {
    const scrambled = generateScrambledPlanets(planets);
    setScrambledPlanets(scrambled);
    setCurrentPlanetIndex(0);
    setScore(0);
    setStrikes(0);
    setRemainingPasses(3);
    localStorage.removeItem('planetScrambleState');
  };

  if (currentPlanetIndex >= scrambledPlanets.length || strikes >= 3) {
    return (
      <div>
        <h1>Game Over</h1>
        <p>{score >= scrambledPlanets.length ? 'You guessed all the planets!' : 'You have too many strikes!'}</p>
        <button onClick={handleRestart}>Play Again</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Planet Scramble</h1>
      <p>Guess the planet: {scrambledPlanets[currentPlanetIndex]}</p>
      <form onSubmit={handleGuess}>
        <input
          type="text"
          value={inputGuess}
          onChange={(e) => setInputGuess(e.target.value)}
          required
        />
        <button type="submit">Guess</button>
      </form>
      <p>Score: {score}</p>
      <p>Strikes: {strikes}</p>
      <p>Passes: {remainingPasses}</p>
      <button onClick={handleSkip} disabled={remainingPasses === 0}>Pass</button>
    </div>
  );
}

ReactDOM.render(<PlanetScramble />, document.getElementById('root'));

