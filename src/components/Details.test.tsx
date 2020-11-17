import React from 'react';
import { render, screen } from '@testing-library/react';
import Details, {DisplayItem} from './Details';

test('renders the empty message when a null entity is passed', () => {
  const entity = null;
  const entityName = 'repo';
  const instructions = [] as Array<DisplayItem>;
  render(<Details entity={entity} entityName={entityName} instructions={instructions} />);
  const emptyMessageElement = screen.getByText('Select a repo to see details!');
  expect(emptyMessageElement).toBeInTheDocument();
});

test('renders the correct items from the entity according to the instructions', () => {
  const entity = {
    foo: 'lorem',
    baz: {
      bar: 'ipsum',
    },
  };
  const entityName = 'repo';
  const instructions = [
    { label: 'Foo', path: 'foo' },
    { label: 'Bar', path: 'baz.bar' },
    { label: 'Nope', path: 'baz.nope' },
  ];
  const { queryByText } = render(<Details entity={entity} entityName={entityName} instructions={instructions} />);
  const firstLabelElement = screen.getByText('Foo');
  const secondLabelElement = screen.getByText('Bar');
  const firstValueElement = screen.getByText('lorem');
  const secondValueElement = screen.getByText('ipsum');
  expect(firstLabelElement).toBeInTheDocument();
  expect(secondLabelElement).toBeInTheDocument();
  expect(firstValueElement).toBeInTheDocument();
  expect(secondValueElement).toBeInTheDocument();
  expect(queryByText('Nope')).toBeNull();
});
