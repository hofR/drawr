import { ShapeData } from "../shape";

export interface RectangleData extends ShapeData {
    x: number,
    y: number,
    width?: number,
    height?: number,
    fill: string,
    stroke: string,
    strokeWidth: number
}