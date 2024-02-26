import { Mapper, ShapeDataMapper } from "../../mapper";
import { Rectangle } from "../rectangle";
import { RectangleData } from "../rectangle.data";

export class RectangleDataMapper implements Mapper<Rectangle, RectangleData> {
    map(source: Rectangle): RectangleData {
        const shapeData = new ShapeDataMapper().map(source);
        return {
            x: source.x,
            y: source.y,
            width: source.width,
            height: source.height,
            ...shapeData
        };
    }
}