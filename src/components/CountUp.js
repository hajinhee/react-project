import { CountUp } from "countup.js";
import { useEffect, useRef } from "react";

export function CountNumber({ start, end, duration }) {
  const spanRef = useRef(null);
  const countRef = useRef(null);

  useEffect(() => {
    if (countRef.current === null) {
      countRef.current = new CountUp(spanRef.current, end, {
        startVal: start,
        duration: duration,
        useGrouping: false,
        formattingFn: (n) => n.toString().padStart(5, "0"),
      });
      countRef.current.start();
    } else {
      countRef.current.update(end);
    }
  }, [duration, start, end]);

  return <div ref={spanRef}></div>;
}
