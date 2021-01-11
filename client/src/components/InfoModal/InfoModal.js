import React, {useEffect, useState} from 'react';
import infoModalContent from '../../data/infoModalContent/infoModalContent';
import './InfoModal.css';

export default function InfoModal({content, contentRef}) {
  const [modalContent, setModalContent] = useState(infoModalContent(content));
  
  useEffect(() => {
    setModalContent(infoModalContent(content))
  }, [content])

  return (
    <div ref={contentRef} className="info-modal">
      <p>{modalContent}</p>
    </div>
  );
}
