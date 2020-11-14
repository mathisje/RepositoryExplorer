import React from 'react';
import Spinner from 'react-bootstrap/Spinner';

function LoadingView() {
    return (
        <Spinner
            animation="border"
            role="status"
        >
            <span className="sr-only">loading</span>
        </Spinner>
    );
}

export default LoadingView;
