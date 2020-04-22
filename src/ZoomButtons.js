import React from 'react';
import PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faSearch } from '@fortawesome/free-solid-svg-icons';


import './styles.css';

const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    margin: '10px',
    position: 'absolute',
    zIndex: 1000
};

const ZoomOutButton = ({ disabled, onClick }) => (
    <button className='iconButton' style={{  borderRadius: '20%', margin: '5px', backgroundColor: "#4873FB",padding: "1em", color: "#fff" }} onClick={onClick} disabled={disabled}>
        <FontAwesomeIcon icon={faMinus} />
    </button>
);

const ZoomInButton = ({ disabled, onClick }) => (
    <button className='iconButton' style={{  borderRadius: '20%', margin: '5px', backgroundColor: "#4873FB",padding: "1em", color: "#fff" }} onClick={onClick} disabled={disabled}>
        <FontAwesomeIcon icon={faPlus} />
    </button>
);


const ZoomInMagnifiy = ({ disabled, onClick }) => (
    <button className='iconButton' style={{  borderRadius: '20%', margin: '5px', backgroundColor: "#4873FB",padding: "1em", color: "#fff" }} onClick={onClick} disabled={disabled}>
        <FontAwesomeIcon icon={faSearch} />
    </button>
);

const ZoomButtons = ({ scale, minScale, maxScale, onZoomInClick, onZoomOutClick, onZoomInMagnifiyClick, magnifier }) => (
    <div style={containerStyle}>
        <ZoomInButton onClick={onZoomInClick} disabled={scale >= maxScale || magnifier} />
        <ZoomOutButton onClick={onZoomOutClick} disabled={scale <= minScale || magnifier} />
        <ZoomInMagnifiy onClick={onZoomInMagnifiyClick}  />
    </div>
);

ZoomButtons.propTypes = {
    scale: PropTypes.number.isRequired,
    minScale: PropTypes.number.isRequired,
    maxScale: PropTypes.number.isRequired,
    onZoomInClick: PropTypes.func.isRequired,
    onZoomOutClick: PropTypes.func.isRequired,
    onZoomInMagnifiyClick: PropTypes.func.isRequired,
    magnifier: PropTypes.bool.isRequired,
};

export default ZoomButtons;