import React from 'react';
import {TreeNode} from '../model'
import {Children} from "./children";
import {NodeLabel} from "./node-label";
import {Line, LineProps} from "./line";

export interface Offset {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface NodeProps {
  treeNode?: TreeNode;
  side?: string;
  parentNode?: Node;
}

export interface NodeState {
  lineProps?: LineProps | null;
}

export class Node extends React.Component<NodeProps, NodeState> {

  private nodeLabel: React.RefObject<NodeLabel>;

  constructor(props: NodeProps) {
    super(props);
    this.nodeLabel = React.createRef();
    this.updateRotation = this.updateRotation.bind(this);
    this.state = {lineProps: this.calculateLineProps()};
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateRotation);
    this.updateRotation();
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateRotation);
  }

  updateRotation() {
    const lineProps = this.calculateLineProps();
    this.setState({lineProps: lineProps});
  }

  getOffset(node: Node): Offset {
    if(!(node.nodeLabel.current && node.nodeLabel.current.label.current)) return {left: 0, top: 0, width: 0, height: 0};

    const el = node.nodeLabel.current.label.current;
    const rect = el.getBoundingClientRect();

    return {
      left: rect.left + window.pageXOffset,
      top: rect.top + window.pageYOffset,
      width: rect.width || el.offsetWidth,
      height: rect.height || el.offsetHeight
    };
  }

  calculateLineProps(): LineProps | null {
    const {parentNode} = this.props;

    if (!parentNode) return null;

    const borderWidth = 4;
    const off1 = this.getOffset(parentNode);
    const off2 = this.getOffset(this);
    // bottom right
    const x1 = off1.left + (off1.width / 2);
    const y1 = off1.top + (off1.height / 2);
    // top right
    const x2 = off2.left + (off2.width / 2);
    const y2 = off2.top + (off2.height / 2);
    // distance
    const length = Math.sqrt(((x2 - x1) * (x2 - x1)) + ((y2 - y1) * (y2 - y1)));
    // center
    const cx = ((x1 + x2) / 2) - (length / 2);
    const cy = ((y1 + y2) / 2) - (borderWidth / 2);
    // angle
    const angle = Math.atan2((y1 - y2), (x1 - x2)) * (180 / Math.PI);
    return {x: cx, y: cy, angle: angle, length: length, borderWidth: borderWidth};
  }

  public render(): React.ReactNode {
    const { treeNode } = this.props;
    const { lineProps } = this.state;

    return (
      <li>
        {treeNode && lineProps ? <Line {...lineProps}/> : null }
        {treeNode ? <NodeLabel text={treeNode.value.toString()} ref={this.nodeLabel} /> : null}
        {treeNode && (treeNode.left || treeNode.right) ? <Children treeNode={treeNode} parentNode={this} /> : null}
      </li>
    );
  }

}
