import Konva from "konva";
import { Shape, ShapeState } from "../shape";
import { RectangleData } from "./rectangle.data";

export class Rectangle extends Shape<Konva.Rect, RectangleData> {

    constructor(rectangle: Konva.Rect, state?: ShapeState) {
        super(rectangle, state);
    }

    override mapToData(): RectangleData {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            ...this.shapeData
        };
    }
}
