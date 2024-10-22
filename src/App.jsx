import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const App = () => {
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(60);
  const [gameOver, setGameOver] = useState(true);
  const [molePosition, setMolePosition] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);



  useEffect(() => {
    let countdown;
    let moleInterval;


    if (!gameOver) {

      if (audioRef.current && !isMuted) {
        audioRef.current.play();
      }

      countdown = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(countdown);
            setGameOver(true);
            alert(`Game Over!\nYour final score: ${score}`);
            setScore(0);
            setTimer(60);

            if (audioRef.current) {
              audioRef.current.pause();
              audioRef.current.currentTime = 0;
            }
            return 60;
          }
          return prevTimer - 1;
        });
      }, 1000);

      moleInterval = setInterval(() => {
        if (!gameOver) {
          const random = Math.floor(Math.random() * 9);
          setMolePosition(random);
        }
      }, 1000);
    }

    return () => {
      clearInterval(countdown);
      clearInterval(moleInterval);
    };
  }, [gameOver, score, isMuted]);

  const startGame = () => {
    if (!gameOver) return;
    setGameOver(false);
    setScore(0);
    setTimer(60);
  };

  const endGame = () => {
    setGameOver(true);
    alert(`Game Ended!\nYour final score: ${score}`);



    setScore(0);
    setTimer(60);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const handleMoleClick = () => {
    if (!gameOver) {
      setScore(score + 1);
      setTimeout(() => {
        setMolePosition(null);
      }, 500);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
    }
  };

  return (
    <div className="App">
      <div className="game-info">
        <div id="score">Score: {score}</div>
        <div id="timer">Time: {timer}s</div>
      </div>
      <button id="startButton" onClick={startGame} disabled={!gameOver}>
        Start Game
      </button>
      <button id="endButton" onClick={endGame} disabled={gameOver}>
        End Game
      </button>
      <button id="muteButton" onClick={toggleMute}>
        <i style={{ color: "#EDF67D" }} className={isMuted ? "fa-solid fa-volume-xmark" : "fa-solid fa-volume-high"}></i>
      </button>

      <div className="game-container">
        {Array.from({ length: 9 }).map((_, index) => (
          <div
            key={index}
            className={`hole ${molePosition === index ? 'mole' : ''}`}
            onClick={molePosition === index ? handleMoleClick : undefined}
          ></div>
        ))}
      </div>


      <audio ref={audioRef} loop>
        <source src="/sadmouse.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default App;

