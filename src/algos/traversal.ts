import {TreeNode} from '../model'

export class TraversalAlgo {

  public preorder(node: TreeNode): number[] {
    const ret: number[] = [];
    if(!node) return ret;

    const s1: TreeNode[] = [];
    s1.push(node);

    while(s1.length > 0) {
      const temp = <TreeNode>s1.pop();
      ret.push(temp.value);
      if(temp.right) s1.push(temp.right);
      if(temp.left) s1.push(temp.left);
    }

    return ret;
  }

  public inorder(node: TreeNode): number[] {
    const ret: number[] = [];
    return ret;
  }

  public postorder(node: TreeNode): number[] {
    const ret: number[] = [];
    return ret;
  }

}
