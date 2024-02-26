import Konva from "konva";
import { ShapeFactory } from "../shape-factory";
import { PolygonData } from "./polygon";
import { ShapeType } from "../shape";

export class PolygonFactory extends ShapeFactory<Konva.Line, PolygonData> {

    override shapeType: ShapeType = 'POLYGON'

    override fromKonva(line: Konva.Line): PolygonData {
        return {
            type: this.shapeType,
            points: line.points(),
            fill: line.fill(),
            stroke: line.stroke(),
            strokeWidth: line.strokeWidth(),
            closed: true
        }
    }

    override toKonva(polygon: Partial<PolygonData>): Konva.Line {
        return this.createKonvaShape(new Konva.Line({
            points: polygon.points,
            fill: polygon.fill,
            stroke: polygon.stroke,
            strokeWidth: polygon.strokeWidth,
            closed: polygon.closed
        }));
    }
}