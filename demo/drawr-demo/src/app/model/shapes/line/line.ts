import Konva from "konva";
import { Shape, ShapeData } from "../shape";
import { LineDataMapper } from "../mapper";

export interface LineData extends ShapeData {
    points: number[];
}

export class Line extends Shape<Konva.Line> {

    constructor(line: Konva.Line) {
        super(line);
    }

    get points(): number[] {
        return this.shape.points();
    }
   
    override toData(): LineData {
        return new LineDataMapper().map(this);
    }
}
