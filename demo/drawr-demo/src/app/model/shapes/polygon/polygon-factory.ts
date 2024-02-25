import Konva from "konva";
import { ShapeFactory } from "../shape-factory";
import { Polygon } from "./polygon";

export class PolygonFactory extends ShapeFactory {
    override fromKonva(line: Konva.Line): Polygon {
        return {
            type: 'POLYGON',
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
            closed: true
        });
    }
}