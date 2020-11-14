import React from 'react';

type Props = {
    item: Record<string, any> | null;
    propertiesToDisplay: Record<string, string>;
}

function Details({item, propertiesToDisplay}: Props) {
    if (!item) {
        return <>Select an item to see details!</>;
    }
    const details = Object.entries(item)
        .filter(([key, value]) => Object.keys(propertiesToDisplay).includes(key))
        .map(([key, value], index) => {
                return (
                    <>
                    <div className="details-cell"><b>{propertiesToDisplay[key]}</b></div>
                    <div className="details-cell">{String(value)}</div>
                    </>
                );
            }
        );
    return <div className="details-grid">{details}</div>
}

export default Details;
