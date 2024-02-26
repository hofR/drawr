import Konva from "konva";
import { ShapeFactory } from "../shape-factory";
import { ShapeType } from "../shape";
import { LineData } from "./line";

export class LineFactory extends ShapeFactory<Konva.Line, LineData> {
    override shapeType: ShapeType = 'LINE';

    override fromKonva(line: Konva.Line): LineData {
        return {
            type: this.shapeType,
            points: line.points(),
            fill: line.fill(),
            stroke: line.stroke(),
            strokeWidth: line.strokeWidth(),
        }
    }

    override toKonva(line: Partial<LineData>): Konva.Line {
        return this.createKonvaShape(new Konva.Line({
            points: line.points,
            fill: line.fill,
            stroke: line.stroke,
            strokeWidth: line.strokeWidth,
        }));
    }
}