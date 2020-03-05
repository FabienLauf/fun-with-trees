import React from 'react';
import {TreeNode} from "../model";
import {Node} from "./node";

export interface TreeProps {
  root: TreeNode;
}

export class Tree extends React.Component<TreeProps> {
  public render(): React.ReactNode {
    const { root } = this.props;

    return (
      <div className="tree">
        <ul className="rootNode">
          <Node treeNode={root} />
        </ul>
      </div>
    );
  }
}
