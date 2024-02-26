import Konva from "konva";
import { Shape, ShapeData } from "../shape";
import { RectangleDataMapper } from "../mapper";

export interface RectangleData extends ShapeData {
    x: number,
    y: number,
    width?: number,
    height?: number,
    fill: string,
    stroke: string,
    strokeWidth: number
}

export class Rectangle extends Shape<Konva.Rect> {

    constructor(rectangle: Konva.Rect) {
        super(rectangle);
    }
   
    override toData(): RectangleData {
        return new RectangleDataMapper().map(this);
    }
}
