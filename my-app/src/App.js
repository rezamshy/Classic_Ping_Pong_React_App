import './App.css';
import { useState, useEffect, useMemo } from 'react';

function Paddle({pos, onChange}) {
    useEffect(() => {
      if (pos.y == 670){
        const handleKeyDown = (event) => {
          const { key } = event;
          let newX = pos.x;

          // Update position based on keyboard input
          switch (key) {
            case 'ArrowLeft':
              newX -= 25;
              break;
            case 'ArrowRight':
              newX += 25;
              break;
            default:
              break;
          }

          onChange(pos, newX);
        };

      // Attach event listener when the component mounts
      window.addEventListener('keydown', handleKeyDown);

      // Clean up event listener when the component unmounts
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [pos]);

  return (
    <button className='paddle' style={{position: 'absolute', top: pos.y, left: pos.x }}/>
  );
}

function Ball({pos, speed, onPosChange, onSpeedChange}) {

  useEffect(() => {
    const interval = setInterval(() => {
      let xs = speed.x;
      let ys = speed.y;
      if (pos.y + 25 > 700)
        ys = -2;
      else if (pos.y < 100)
        ys = 2;
      if (pos.x < 400)
        xs = 2;
      else if (pos.x + 25 > 1100)
        xs = -2;

      onSpeedChange(xs, ys);

      onPosChange(pos.x + xs, pos.y + ys);
    }, 10); // Move the ball every 10 milliseconds

    return () => {
      clearInterval(interval); // Clean up the interval on component unmount
    };
  }, [pos]);

  return (
    <div
      style={{
        position: 'absolute',
        top: pos.y,
        left: pos.x,
        width: '25px',
        height: '25px',
        backgroundColor: 'red',
        borderRadius: '50%',
      }}
    />
  );
};


function App() {

  const [p1Pos, p1SetPos] = useState({x:700, y:120});
  const [p2Pos, p2SetPos] = useState({x:700, y:670});
  const [p1Score, p1SetScore] = useState(0);
  const [p2Score, p2SetScore] = useState(0);
  const [p1Speed, setP1Speed] = useState(5);
  const [ballPos, setBallPos] = useState({x:700, y:400});
  const [ballSpeed, setBallSpeed] = useState({x:2, y:2});

  function updatePaddlePos (pos, newX) {
      if (pos.y == 120)
        p1SetPos({x:newX, y:pos.y});
      else
        p2SetPos({x:newX, y:pos.y});
  }

  function updateBallPos (x, y) {
    setBallPos({x: x, y: y});
  }

  function updateBallSpeed (x, y) {
    setBallSpeed({x:x, y:y});
  }

  // AI
  useEffect(() => {
    let p = Math.random() * 15;
    if (p1Pos.x + 50 + p < ballPos.x + 12) {
      setP1Speed(3);
    } else if(p1Pos.x - p > ballPos.x + 12 ) {
      setP1Speed(-3);
    }
    else{
      setP1Speed(0 );
    }

    p1SetPos((prevPos) => ({x:prevPos.x + p1Speed, y:prevPos.y}));
  }, [ballPos]);

  

  if (ballPos.x + 25 > p1Pos.x && ballPos.x < p1Pos.x + 50 && ballPos.y == 130 && ballSpeed.y!=2 ){
    setBallSpeed({x:ballSpeed.x, y:2});
  }

  if (ballPos.y == 100){
    p2SetScore((prev)=>(prev+1));
    setBallPos({x: 400, y:400})
  } 

  return (
    <main>
       <h1> Hi! you can play Ping Pong here.</h1>
      
       <canvas></canvas>
       <h2 className='score' style={{top: '120px', left: '1200px'}}>{p1Score}</h2>
       <h2 className='score' style={{top: '620px', left: '1200px'}}>{p2Score}</h2>
       <Paddle pos={p1Pos} onChange={updatePaddlePos} />
       <Paddle pos={p2Pos} onChange={updatePaddlePos} />
       <Ball pos={ballPos} speed={ballSpeed} onPosChange={updateBallPos} onSpeedChange={updateBallSpeed}/>
    </main>
  );
}

export default App;
