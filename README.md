# react-responsive-pinch-zoom-pan-magnifier

A React component that adds pinch-zoom and pan capability to an `<img>` element. Both mobile and desktop browsers are supported. On desktop browsers, zoom is triggered via the mouse scrollwheel.

Zoom and pan are applied using CSS transforms. 

## Install

`npm install react-responsive-pinch-zoom-pan-magnifier --save`

### Local

1. `git clone https://github.com/bradstiff/react-responsive-pinch-zoom-pan-magnifier.git`
2. `cd react-responsive-pinch-zoom-pan-magnifier`
3. `npm install`
4. `npm start`
5. Browse to http://localhost:3001

## Usage

```javascript
import React from "react";
import PinchZoomPan from "react-responsive-pinch-zoom-pan-magnifier";

const App = () => {
    return (
        <div style={{ width: '500px', height: '500px' }}>
            <PinchZoomPan>
                <img alt='Test Image' src='http://via.placeholder.com/750x750' />
            </PinchZoomPan>
        </div>
    );
};
