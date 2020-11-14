import React from 'react';
import Badge from 'react-bootstrap/Badge';

type Props = {
    error: Error;
}

function ErrorView({error}: Props) {
    return (
        <div className="error-container">
            <Badge pill variant="danger">Oops, something went wrong!</Badge>
            <div>{error.message}</div>
        </div>
    );
}

export default ErrorView;
