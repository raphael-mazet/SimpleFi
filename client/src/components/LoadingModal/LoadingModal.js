import React, {useState, useEffect} from 'react';
import './LoadingModal.css'

export default function LoadingModal({splash, loadingMessage}) {

  const [display, setDisplay] = useState({display: 'none'});

  useEffect(() => {
    const {headline} = loadingMessage;
    if (splash && headline) {
      setDisplay({display: 'block'});
    } else {
      setDisplay({display: 'none'})
    }
  }, [splash, loadingMessage])

  return (
    <div className="loading-modal" style={display}>
      <div className="modal-content">
        <div className="modal-text">
          <h2>{loadingMessage.headline}</h2>
          <div className="loading-actions">
            {loadingMessage.actions.map((action) => {
              let tick;
              if (action.slice(-2) === '✔️') {
                tick = <span className="modal-tick">✔</span>
                action = action.slice(0, -2);
              }
              return (<p key={action}>{action}{tick}</p>)
            })
          }
          </div>
        </div>
        <div className="loading-animation">
          <div className="dot-bricks"></div>
        </div>
      </div>
    </div>
  )
}