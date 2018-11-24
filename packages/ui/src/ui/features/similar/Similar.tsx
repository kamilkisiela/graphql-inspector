import React from 'react';

export default function Similar() {
  return (
    <ul>
      <li>List all all types as blocks</li>
      <li>Types that have no similar types should be faded</li>
      <li>A block should show a best match, it should be super visible</li>
      <li>A block should show a list of top 5 matchings, the rest should be expandable</li>
      <li>Clicking on a block should open a modal window with details: fully printed types</li>
    </ul>
  );
}
