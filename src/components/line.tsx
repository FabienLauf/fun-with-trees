import React from "react";

export interface LineProps {
  x: number;
  y: number;
  angle: number;
  length: number;
  borderWidth: number;
}

export class Line extends React.Component<LineProps> {

    public constructor(props: LineProps) {
      super(props);
    }

    render(): React.ReactNode {
        const { x, y, length, angle, borderWidth} = this.props;
        return <div
                className={'line'}
                style={{
                  borderBottomWidth: `${borderWidth}px`,
                  left: `${x}px`,
                  top: `${y}px`,
                  width: `${length}px`,
                  transform: `rotate(${angle}deg)`
                }}
        />
    }
}
/*
"-moz-transform": `rotate(${angle}deg)`,
"-webkit-transform": `rotate(${angle}deg)`,
"-o-transform": `rotate(${angle}deg)`,
"-ms-transform": `rotate(${angle}deg)`,
 */
