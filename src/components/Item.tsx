import React from 'react';

type Props = {
  label: string;
  value: string;
}

/* Component to display a label and value in a grid layout */
function Item({ label, value }: Props) {

  if (value === undefined) {
    return <></>;
  }
  return (
    <>
      <div className="details-cell"><b>{label}</b></div>
      <div className="details-cell">{String(value)}</div>
    </>
  );
}

export default Item;
