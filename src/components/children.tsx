import React from 'react';
import {TreeNode} from '../model'
import {Node} from './node'

export interface ChildrenProps {
  treeNode: TreeNode;
  parentNode?: Node;
}

export class Children extends React.Component<ChildrenProps> {
  public render(): React.ReactNode {
    const { treeNode, parentNode } = this.props;

    return (
      <ul className='flex-container'>
        <Node treeNode={treeNode.left} side='left' parentNode={parentNode} />
        <Node treeNode={treeNode.right} side='right' parentNode={parentNode} />
      </ul>
  );
  }
}
