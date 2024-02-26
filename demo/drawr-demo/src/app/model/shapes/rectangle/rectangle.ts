import Konva from "konva";
import { Shape } from "../shape";
import { RectangleDataMapper } from "./mapper/rectangle-data.mapper";
import { RectangleData } from "./rectangle.data";

export class Rectangle extends Shape<Konva.Rect> {

    constructor(rectangle: Konva.Rect) {
        super(rectangle);
    }
   
    override toData(): RectangleData {
        return new RectangleDataMapper().map(this);
    }

}
