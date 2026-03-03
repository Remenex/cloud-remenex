"use client";
import { useEffect, useRef } from "react";

const GRID_SIZE = 50;
const LERP_FACTOR = 0.08; // što manje -> sporije prati miš

export default function GridBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    const mouse = { x: 0, y: 0 };
    const smooth = { x: 0, y: 0 };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    function drawGrid(offsetX: number, offsetY: number) {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      ctx.strokeStyle = "rgba(75, 85, 99, 0.4)"; // siva linija
      ctx.lineWidth = 1;

      for (let x = -GRID_SIZE; x < width + GRID_SIZE; x += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(x + offsetX, 0);
        ctx.lineTo(x + offsetX, height);
        ctx.stroke();
      }

      for (let y = -GRID_SIZE; y < height + GRID_SIZE; y += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(0, y + offsetY);
        ctx.lineTo(width, y + offsetY);
        ctx.stroke();
      }
    }

    function animate() {
      // Smooth lerp
      smooth.x += (mouse.x - smooth.x) * LERP_FACTOR;
      smooth.y += (mouse.y - smooth.y) * LERP_FACTOR;

      const offsetX = (smooth.x * 0.05) % GRID_SIZE;
      const offsetY = (smooth.y * 0.05) % GRID_SIZE;

      drawGrid(offsetX, offsetY);
      requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 -z-10 bg-black" />;
}
