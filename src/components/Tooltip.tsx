import React, { useState, useRef, useEffect } from "react";
import Portal from "./Portal";

interface Props {
  text: string;
  key?: any;
  width?: number;
}

const Tooltip: React.FC<Props> = ({
  text,
  children,
  width = 120,
  ...props
}) => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      setIsMobile(true);
    }
  }, []);

  const [showTooltip, setShowTooltip] = useState(false);

  const tooltipCoordinates = useRef({ x: 0, y: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null!);

  const handleMouseOver = (e: React.MouseEvent) => {
    setShowTooltip(true);
    tooltipCoordinates.current = getCoordinates(tooltipRef, e.currentTarget);
  };

  const getCoordinates = (tt: any, el: EventTarget & Element) => {
    const elementWidth = el.clientWidth;
    const elementBox = el.getBoundingClientRect();
    const diff = (elementWidth - width) / 2;
    return { x: elementBox.left + diff - 9, y: elementBox.top - 50 };
  };

  const handleMouseOut = (e: React.MouseEvent) => {
    setShowTooltip(false);
  };

  return (
    <>
      {React.cloneElement(children as React.ReactElement<any>, {
        onMouseOver: handleMouseOver,
        onMouseOut: handleMouseOut,
      })}
      <Portal>
        <div
          ref={tooltipRef}
          key={props.key}
          style={{
            position: "fixed",
            width: width,
            left: tooltipCoordinates.current.x,
            top: tooltipCoordinates.current.y,
            display: showTooltip && !isMobile ? "inline-block" : "none",
            zIndex: 1000,
            backgroundColor: "grey",
            fontSize: "13px",
            padding: "5px 10px",
            color: "white",
            borderRadius: "5px",
            opacity: showTooltip ? 1 : 0,
          }}
          className="tooltip"
        >
          {text}
        </div>
      </Portal>
    </>
  );
};

export default Tooltip;
