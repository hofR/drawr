import { Shape, ShapeConfig } from "../shape";

export interface Rectangle extends Shape {
    x: number,
    y: number,
    width?: number,
    height?: number,
    fill: string,
    stroke: string,
    strokeWidth: number
}