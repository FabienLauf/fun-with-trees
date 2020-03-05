import {TraversalAlgo} from "../../src/algos/traversal";
import {TreeNode} from "../../src/model";

describe('TraversalAlgos', () => {
  const traversalAlgos = new TraversalAlgo();
  const tree: TreeNode = {
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

  describe('Preorder', () => {
    it('returns preorder traversal of a tree as an array of numbers', () => {
      const pre = traversalAlgos.preorder(tree);
      expect(pre).toEqual([5,4,1,7,6,8]);
    });
  });
});
