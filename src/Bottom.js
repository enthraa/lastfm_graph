import React from 'react';

function Bottom() {
  const bottomContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100px',
    backgroundColor: '#ff5733', // Modifier ici pour la couleur désirée
    color: 'white',
  };
  const imageStyle = {
    maxWidth: '35px', // Définissez la largeur maximale souhaitée
    maxHeight: '35px', // Définissez la hauteur maximale souhaitée
  };

  return (
    <div className="Bottom" style={bottomContainerStyle}>
      <a href="https://www.last.fm/fr/user/EdelweissNoir"><img src="../img/lastfm.jpeg" alt="lastfm" style={imageStyle}/></a>
      <a href="https://twitter.com/rougeatres_"><img src="../img/twitter.jpeg" alt="twitter" style={imageStyle}/></a>
    </div>
  );
}

export default Bottom;
