import Konva from "konva";
import { Shape, ShapeData } from "../shape";
import { PolygonDataMapper } from "../mapper";

export interface PolygonData extends ShapeData {
    points: number[];
    closed: boolean;
}

export class Polygon extends Shape<Konva.Line> {

    constructor(line: Konva.Line) {
        super(line);
    }

    get points(): number[] {
        return this.shape.points();
    }
   
    override toData(): PolygonData {
        return new PolygonDataMapper().map(this);
    }
}
