import React from 'react';
import '../stylesheets/menu.scss';
import '../stylesheets/binary-tree.scss';
import {Menu} from "../components";
import {Tree} from "../components";
import {TreeNode} from "../model";

const App: React.FC = () => {
  const root: TreeNode = {
    value: 5,
    left: {
      value: 4,
      left: {
        value: 1
      }
    },
    right: {
      value: 7,
      left: {
        value: 6
      },
      right: {
        value: 8
      }
    }
  };

  return (
    <div className="funWithTrees flex-container">
      <Menu />
      <Tree root={root} />
    </div>
  );
};

export default App;
