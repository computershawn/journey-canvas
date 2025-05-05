import React, { useState, useRef, useEffect } from 'react';

const rad = 16;
const pointRad = 3;

const BeziControlsAlt = () => {
  const canvasRef = useRef(null);
  // const [isDragging, setIsDragging] = useState(false);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  // const [shape, setShape] = useState({
  //   x: 50,
  //   y: 50,
  //   width: 50,
  //   height: 50,
  // });
  const [dragIndex, setDragIndex] = useState(-1);

  // const [points, setPoints] = useState([
  //   {
  //     x: 50,
  //     y: 150,
  //   },
  //   {
  //     x: 60,
  //     y: 100,
  //   },
  //   {
  //     x: 150,
  //     y: 150,
  //   },
  //   {
  //     x: 160,
  //     y: 90,
  //   },
  //   {
  //     x: 300,
  //     y: 150,
  //   },
  //   {
  //     x: 310,
  //     y: 80,
  //   },
  // ]);
  const [points, setPoints] = useState([
    { x: 50, y: 150, child: [1] },
    { x: 60, y: 100, child: null },
    { x: 150, y: 150, child: null },
    { x: 160, y: 90, child: [2, -1] },
    { x: 300, y: 150, child: null },
    { x: 310, y: 80, child: [4] },
  ]);

  // useEffect(() => {
  //   const canvas = canvasRef.current;
  //   const context = canvas.getContext('2d');

  //   const drawShape = () => {
  //     context.clearRect(0, 0, canvas.width, canvas.height);
  //     context.fillStyle = 'blue';
  //     context.fillRect(shape.x, shape.y, shape.width, shape.height);
  //   };

  //   drawShape();
  // }, [shape]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const colors = ['red', 'pink', 'green', 'lightgreen', 'blue', 'lightblue'];
    const drawShapes = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      points.forEach((p, i) => {
        ctx.fillStyle = colors[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, rad, 0, 2 * Math.PI);
        ctx.fill();
      });
      // points.forEach((pt) => {
      //   // Circle around anchors and control points
      //   ctx.strokeStyle = '#00ffff';
      //   ctx.fillStyle = '#00ffffff';
      //   ctx.beginPath();
      //   ctx.arc(pt.x, pt.y, rad, 0, 2 * Math.PI);
      //   ctx.stroke();
      //   if (pt.child) {
      //     ctx.fill();
      //   }
      // });
    };

    if (ctx) {
      drawShapes();
    }
  }, [dragIndex, points]);

  // const handleMouseDown = (e) => {
  //   const canvas = canvasRef.current;
  //   const rect = canvas.getBoundingClientRect();
  //   const mouseX = e.clientX - rect.left;
  //   const mouseY = e.clientY - rect.top;
  //   if (
  //     mouseX >= shape.x &&
  //     mouseX <= shape.x + shape.width &&
  //     mouseY >= shape.y &&
  //     mouseY <= shape.y + shape.height
  //   ) {
  //     setIsDragging(true);
  //     setOffsetX(mouseX - shape.x);
  //     setOffsetY(mouseY - shape.y);
  //   }
  // };

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const nearestIndex = getNearest(mouseX, mouseY);
    if (nearestIndex !== -1) {
      setDragIndex(nearestIndex);
      setOffsetX(mouseX - points[nearestIndex].x);
      setOffsetY(mouseY - points[nearestIndex].y);
    }
  };

  const getNearest = (mouseX: number, mouseY: number) => {
    let dx = mouseX - points[0].x;
    let dy = mouseY - points[0].y;
    let d = Math.sqrt(dx * dx + dy * dy);
    let index = d <= rad ? 0 : -1;

    for (let i = 1; i < points.length; i++) {
      dx = mouseX - points[i].x;
      dy = mouseY - points[i].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < d) {
        d = dist;
        index = i;
      }
    }

    if (d <= rad) {
      return index;
    }

    return -1;
  };

  // const handleMouseMove = (e) => {
  //   if (isDragging) {
  //     const canvas = canvasRef.current;
  //     const rect = canvas.getBoundingClientRect();
  //     const mouseX = e.clientX - rect.left;
  //     const mouseY = e.clientY - rect.top;

  //     setShape((prevShape) => ({
  //       ...prevShape,
  //       x: mouseX - offsetX,
  //       y: mouseY - offsetY,
  //     }));
  //   }
  // };

  const handleMouseMove = (e) => {
    if (dragIndex !== -1) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const updated = points.map((pt, i) => {
        if (i !== dragIndex) {
          return pt;
        }
        return {
          ...pt,
          x: mouseX - offsetX,
          y: mouseY - offsetY,
        };
      });

      setPoints(updated);
    }
  };

  // const handleMouseUp = () => {
  //   setIsDragging(false);
  // };

  const handleMouseUp = () => {
    setDragIndex(-1);
  };

  return (
    <canvas
      ref={canvasRef}
      width={500}
      height={300}
      style={{ border: '1px solid black' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    />
  );

  // return <div>wassup fool</div>;
};

export default BeziControlsAlt;
