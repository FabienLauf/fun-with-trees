import React from "react";

export interface NodeLabelProps {
  text: string;
}

export class NodeLabel extends React.Component<NodeLabelProps> {

  public label: React.RefObject<HTMLLabelElement>;

  public constructor(props: NodeLabelProps) {
    super(props);
    this.label = React.createRef()
  }

  public render(): React.ReactNode {
    const { text } = this.props;

    return (
      <div className="node-label">
        <input id="WithLabel" type="checkbox" className="is-visually-hidden" />
        <label ref={this.label} htmlFor="WithLabel">
          <span className="node-label-content">
            <span className="node-label-text">{ text }</span>
          </span>
        </label>
      </div>
    /* <span className="node-label">{text}</span> */
    );
  }

}
