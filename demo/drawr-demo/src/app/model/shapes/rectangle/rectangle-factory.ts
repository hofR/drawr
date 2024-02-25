import Konva from "konva";
import { ShapeFactory } from "../shape-factory";
import { Rectangle } from "./rectangle";
import { ShapeType } from "../shape";

export class RectangleFactory extends ShapeFactory<Konva.Rect, Rectangle> {
    override shapeType: ShapeType = 'RECTANGLE';

    override fromKonva(rect: Konva.Rect): Rectangle {
        return {
            type: this.shapeType,
            x: rect.x(),
            y: rect.y(),
            width: rect.width(),
            height: rect.height(),
            fill: rect.fill(),
            stroke: rect.stroke(),
            strokeWidth: rect.strokeWidth(),
        }
    }

    override toKonva(rectangle: Partial<Rectangle>): Konva.Rect {
        return this.createKonvaShape(new Konva.Rect({
            x: rectangle.x,
            y: rectangle.y,
            width: rectangle.width,
            height: rectangle.height,
            fill: rectangle.fill,
            stroke: rectangle.stroke,
            strokeWidth: rectangle.strokeWidth,
        }));
    }
}
