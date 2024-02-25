import Konva from "konva";
import { ShapeFactory } from "../shape-factory";
import { Polygon } from "../polygon/polygon";

export class LineFactory extends ShapeFactory {
    override fromKonva(line: Konva.Line): Polygon {
        return {
            type: 'LINE',
            points: line.points(),
            fill: line.fill(),
            stroke: line.stroke(),
            strokeWidth: line.strokeWidth(),
        }
    }

    override toKonva(polygon: Polygon): Konva.Line {
        return new Konva.Line({
            points: polygon.points,
            fill: polygon.fill,
            stroke: polygon.stroke,
            strokeWidth: polygon.strokeWidth,
        });
    }
}