import Konva from "konva";
import { Shape } from "./shape";

export interface Rectangle extends Shape{
    x: number,
    y: number,
    width: number,
    height: number,
    fill: string,
    stroke: string,
    strokeWidth: number
}

export function fromShape(shape: Konva.Shape): Rectangle {
    return <Rectangle>{
        x: shape.x(),
        y: shape.y(),
        width: shape.width(),
        height: shape.height(),
        fill: shape.fill(),
        stroke: shape.stroke(),
        strokeWidth: shape.strokeWidth(),
    }
}

export function toKonvaRect(rectangle: Rectangle): Konva.Rect {
    return new Konva.Rect({
        x: rectangle.x,
        y: rectangle.y,
        width: rectangle.width,
        height: rectangle.height,
        fill: rectangle.fill,
        stroke: rectangle.stroke,
        strokeWidth: rectangle.strokeWidth,
    });
}