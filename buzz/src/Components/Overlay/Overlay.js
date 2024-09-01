import React, { useRef, useEffect } from 'react';
import './Overlay.css';

const Overlay = ({ isVisible, onClose, children, colors}) => {
  const overlayRef = useRef(null);

  const handleClickOutside = (event) => {
    if (overlayRef.current && !overlayRef.current.contains(event.target)) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isVisible) return null;

  return (
    <div className={`backdrop ${isVisible ? 'show' : 'hide'}`}>
      <div className="overlay" ref={overlayRef} style={{color: colors.sidebarText, backgroundColor: colors.sidebarBackground}}>
        {children}
      </div>
    </div>
    
  );
};

export default Overlay;