import React from 'react';

export class Menu extends React.Component {
  public render(): React.ReactNode {

    return (
      <nav>
        <ul>
          <li>Serialisation</li>
          <li>Pre-order</li>
          <li>Inorder</li>
          <li>Post-order</li>
        </ul>
      </nav>
    );
  }
}
