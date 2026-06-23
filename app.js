const {useState, useRef} = React;

function ElevatorApp(){
  const [currentFloor, setCurrentFloor] = useState(null); // null means FLOOR
  const [activeFloor, setActiveFloor] = useState(null);
  const [displayFloor, setDisplayFloor] = useState('FLOOR');
  const [direction, setDirection] = useState(null);
  const [doorOpen, setDoorOpen] = useState(false);
  const [moving, setMoving] = useState(false);
  const [arrived, setArrived] = useState(false);
  const movingRef = useRef(false);

  function openDoors(){
    setDoorOpen(true);
  }
  function closeDoors(){
    setDoorOpen(false);
  }

  function handleSelect(target){
    if(movingRef.current) return;
    if(currentFloor === target) return;
    movingRef.current = true;
    setMoving(true);
    setArrived(false);
    setActiveFloor(target);

    // determine direction
    const start = currentFloor === null ? 0 : currentFloor;
    const dir = target > start ? 'UP' : 'DOWN';
    setDirection(dir);

    // close doors
    closeDoors();

    // after doors closed, simulate subtle move
    setTimeout(()=>{
      // simulate floor display stepping
      const steps = [];
      const s = start;
      const t = target;
      const step = t > s ? 1 : -1;
      for(let f = s+step; ; f+=step){
        steps.push(f);
        if(f===t) break;
      }
      let idx = 0;
      const interval = setInterval(()=>{
        const f = steps[idx++];
        setDisplayFloor(f===0? 'FLOOR' : f+"F");
        if(idx>=steps.length){
          clearInterval(interval);
          // arrived: show small arrival indicator, then open doors
          setArrived(true);
          setTimeout(()=>{
            setCurrentFloor(target);
            setActiveFloor(null);
            setDirection(null);
            openDoors();
            setArrived(false);
            setMoving(false);
            movingRef.current = false;
          }, 500);
        }
      }, 420);
    }, 750);
  }

  // initial open action
  function handleEnter(){
    if(doorOpen){
      closeDoors();
      return;
    }
    openDoors();
    setDisplayFloor('FLOOR');
  }

  // keyboard: Esc to close doors
  React.useEffect(()=>{
    function onKey(e){
      if(e.key === 'Escape') closeDoors();
    }
    window.addEventListener('keydown', onKey);
    return ()=> window.removeEventListener('keydown', onKey);
  },[])

  return (
    <div className="scene">
      <div className="elevator-shell">
            <div className="elevator-frame">
          <div className="elevator-inner">
            <div className="ceiling-light"></div>
            <div className="back-wall"></div>
              <div className={"arrival-badge "+(arrived? 'show':'')} aria-hidden={!arrived}>ARRIVED</div>

            <div className="floor-display">
              <div className="label">DISPLAY</div>
              <div className="value">{displayFloor}</div>
            </div>

            <div className="panel" role="region" aria-label="Elevator panel">
              <div style={{fontSize:12,opacity:0.8,marginBottom:8}}>PANEL</div>
              <div className="button-grid">
                {[1,2,3,4,5].map(n=>{
                  const isActive = activeFloor===n;
                  return (
                    <button key={n} className={"floor-btn "+(isActive? 'active':'')} aria-pressed={isActive} onClick={()=>handleSelect(n)} disabled={moving}>{n}</button>
                  )
                })}
              </div>
              <button className="open-btn" onClick={handleEnter} aria-expanded={doorOpen}>{doorOpen? 'CLOSE' : 'OPEN'}</button>
            </div>

            <div className={"door-viewport"}>
              <div className={"door left "+(doorOpen? 'open':'closed') } aria-hidden={doorOpen}></div>
              <div className={"door right "+(doorOpen? 'open':'closed') } aria-hidden={doorOpen}></div>

              <div className={"content "+(doorOpen && currentFloor? 'visible':'') } style={{zIndex:5}}>
                {currentFloor===1 && (
                  <div>
                    <h1>1F — ABOUT</h1>
                    <p>Park So Hyun · Graphic / Brand / Content Designer</p>
                  </div>
                )}
                {currentFloor===2 && (
                  <div>
                    <h1>2F — EXPERIENCE</h1>
                    <p>Service & Personal brand experience highlights</p>
                  </div>
                )}
                {currentFloor===3 && (
                  <div>
                    <h1>3F — TOOLS</h1>
                    <p>Photoshop · Figma · Illustrator · InDesign · AI Tools</p>
                  </div>
                )}
                {currentFloor===4 && (
                  <div>
                    <h1>4F — PROJECTS</h1>
                    <p>KKOTPICK · noww · RE:ZUL — brief cards</p>
                  </div>
                )}
                {currentFloor===5 && (
                  <div>
                    <h1>5F — LETTER</h1>
                    <p>How I found design · Strengths · Aspirations</p>
                  </div>
                )}
                {!currentFloor && doorOpen && (
                  <div>
                    <h1>WELCOME</h1>
                    <p>Press a floor button to enter Park So Hyun's portfolio.</p>
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<ElevatorApp/>);
