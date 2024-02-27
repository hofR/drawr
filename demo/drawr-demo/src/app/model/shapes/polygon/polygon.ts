import Konva from "konva";
import { Shape, ShapeState } from "../shape";
import { PolygonData } from "..";

export class Polygon extends Shape<Konva.Line, PolygonData> {

    constructor(line: Konva.Line, state?: ShapeState) {
        super(line, state);
    }

    get points(): number[] {
        return this.shape.points();
    }
   
    override mapToData(): PolygonData {
        return {
            points: this.points,
            closed: true,
            ...this.shapeData
        }
    }
}
