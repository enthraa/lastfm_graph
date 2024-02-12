import React from 'react';

function Header() {
  const HeaderContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100px',
  };

  return (
    <div className="Header" style={HeaderContainerStyle}>
      <h3>TreeMap Generator </h3>
    </div>
  );
}

export default Header;

