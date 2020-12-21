import React, {useState, useEffect} from 'react';
import './LoadingModal.css'

export default function LoadingModal({loadingMessage}) {

  const [display, setDisplay] = useState({display: 'none'});

  useEffect(() => {
    const {headline} = loadingMessage;
    if (headline) {
      setDisplay({display: 'block'});
    } else {
      setDisplay({display: 'none'})
    }
  }, [loadingMessage])

  return (
    <div className="loading-modal" style={display}>
      <div className="modal-content">
        <h2>{loadingMessage.headline}</h2>
        <div className="loading-actions">
          {loadingMessage.actions.map((action) => {return (<p>{action}</p>)})}
        </div>
      </div>
    </div>
  )
}