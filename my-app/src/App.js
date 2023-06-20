import './App.css';
import { useState, useEffect } from 'react';

function Paddle({pos, onChange}) {

  useEffect(() => {
    const handleKeyDown = (event) => {
      const { key } = event;
      let newX = pos.x;

      // Update position based on keyboard input
      switch (key) {
        case 'ArrowLeft':
          newX -= 20;
          break;
        case 'ArrowRight':
          newX += 20;
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
  }, [pos]);

  return (
    <button className='rectangle' style={{position: 'absolute', top: pos.y, left: pos.x }}/>
  );
}

function Ball({pos, speed, onPosChange, onSpeedChange}) {

  useEffect(() => {
    const interval = setInterval(() => {
      let xs = speed.x;
      let ys = speed.y;
      if (pos.y > 700)
        ys = -2;
      else if (pos.y < 200)
        ys = 2;
      if (pos.x < 10)
        xs = 2;
      else if (pos.x >700)
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

  const [p1Pos, p1SetPos] = useState({x:10, y:200});
  const [p2Pos, p2SetPos] = useState({x:10, y:700});
  const [ballPos, setBallPos] = useState({x:400, y:400});
  const [ballSpeed, setBallSpeed] = useState({x:2, y:2});

  function updatePaddlePos (pos, newX) {
      if (pos.y == 200)
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

  if (ballPos.x > p1Pos.x && ballPos.x < p1Pos.x + 25 && ballPos.y < 205 && ballSpeed.y!=1 ){
    setBallSpeed({x:ballSpeed.x, y:1});
  }

  return (
    <main>
       <h1> Hi! you can play Ping Pong here.</h1>

       <Paddle pos={p1Pos} onChange={updatePaddlePos} />
       <Paddle pos={p2Pos} onChange={updatePaddlePos} />
       <Ball pos={ballPos} speed={ballSpeed} onPosChange={updateBallPos} onSpeedChange={updateBallSpeed}/>
    </main>
  );
}

export default App;
