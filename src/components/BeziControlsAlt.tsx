import React, { useState, useRef, useEffect } from 'react';

const BeziControlsAlt = () => {
  const canvasRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [shape, setShape] = useState({
    x: 50,
    y: 50,
    width: 50,
    height: 50,
    isDragging: false,
  });
  const [dragIndex, setDragIndex] = useState(-1);

  const [points, setPoints] = useState([
    {
      x: 50,
      y: 150,
      width: 30,
      height: 30,
      rad: 16,
      isDragging: false,
    },
    {
      x: 60,
      y: 100,
      width: 30,
      height: 30,
      rad: 16,
      isDragging: false,
    },
    {
      x: 150,
      y: 150,
      width: 30,
      height: 30,
      rad: 16,
      isDragging: false,
    },
    {
      x: 160,
      y: 90,
      width: 30,
      height: 30,
      rad: 16,
      isDragging: false,
    },
    {
      x: 300,
      y: 150,
      width: 30,
      height: 30,
      rad: 16,
      isDragging: false,
    },
    {
      x: 310,
      y: 80,
      width: 30,
      height: 30,
      rad: 16,
      isDragging: false,
    },
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
    const colors = ['red', 'green', 'blue'];
    const drawShapes = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      points.forEach((p, i) => {
        ctx.fillStyle = colors[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.rad, 0, 2 * Math.PI);
        ctx.fill();
      });
    };

    if (ctx) {
      drawShapes();
    }
  }, [points]);

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const nearestIndex = getNearest(mouseX, mouseY);
    // console.log('nearestIndex', nearestIndex);
    setDragIndex(nearestIndex);

    if (
      mouseX >= shape.x &&
      mouseX <= shape.x + shape.width &&
      mouseY >= shape.y &&
      mouseY <= shape.y + shape.height
    ) {
      setIsDragging(true);
      setOffsetX(mouseX - shape.x);
      setOffsetY(mouseY - shape.y);
    }
  };

  const getNearest = (mouseX: number, mouseY: number) => {
    let dx = mouseX - points[0].x;
    let dy = mouseX - points[0].x;
    let d = Math.sqrt(dx * dx + dy * dy);
    let index = 0;

    for (let i = 1; i < points.length; i++) {
      dx = mouseX - points[i].x;
      dy = mouseY - points[i].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < d) {
        d = dist;
        index = i;
      }
    }

    return index;
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      setShape((prevShape) => ({
        ...prevShape,
        x: mouseX - offsetX,
        y: mouseY - offsetY,
      }));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
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
