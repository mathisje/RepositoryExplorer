import React from 'react';
import get from 'lodash/get';
import Item from './Item';

export type DisplayItem = {
  label: string;
  path: string;
}

type Props = {
  entity: Record<string, any> | null;
  entityName: string,
  instructions: Array<DisplayItem>;
}

/* Component that converts an entity and a set of instructions into items to display from the entity */
function Details({ entity, entityName, instructions }: Props) {

  if (!entity) {
    const emptyMessage = `Select a ${entityName} to see details!`;
    return <>{emptyMessage}</>;
  }

  const details = instructions.map(({ label, path }) => {
    const value = get(entity, path);
    return (
      <Item
        key={label + path}
        label={label}
        value={value}
      />
    );
  });
  return <div className="details-grid">{details}</div>
}

export default Details;
