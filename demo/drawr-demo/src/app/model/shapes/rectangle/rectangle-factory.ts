import Konva from "konva";
import { ShapeFactory } from "../shape-factory";
import { Rectangle } from "./rectangle";

export class RectangleFactory extends ShapeFactory {
    override fromKonva(rect: Konva.Rect): Rectangle {
        return {
            type: 'RECTANGLE',
            x: rect.x(),
            y: rect.y(),
            width: rect.width(),
            height: rect.height(),
            fill: rect.fill(),
            stroke: rect.stroke(),
            strokeWidth: rect.strokeWidth(),
        }
    }

    override toKonva(rectangle: Rectangle): Konva.Rect {
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
}
