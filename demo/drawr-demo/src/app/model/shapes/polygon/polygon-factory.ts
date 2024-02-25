import Konva from "konva";
import { ShapeFactory } from "../shape-factory";
import { Polygon } from "./polygon";
import { ShapeType } from "../shape";

export class PolygonFactory extends ShapeFactory<Konva.Line, Polygon> {

    override shapeType: ShapeType = 'POLYGON'

    override fromKonva(line: Konva.Line): Polygon {
        return {
            type: this.shapeType,
            points: line.points(),
            fill: line.fill(),
            stroke: line.stroke(),
            strokeWidth: line.strokeWidth(),
            closed: true
        }
    }

    override toKonva(polygon: Partial<Polygon>): Konva.Line {
        return this.createKonvaShape(new Konva.Line({
            points: polygon.points,
            fill: polygon.fill,
            stroke: polygon.stroke,
            strokeWidth: polygon.strokeWidth,
            closed: polygon.closed
        }));
    }
}