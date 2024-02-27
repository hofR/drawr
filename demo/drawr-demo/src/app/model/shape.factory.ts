import Konva from "konva";
import { IdHelper } from "./id-helper";
import { Line, Polygon, Rectangle, Shape, ShapeData, ShapeState, ShapeType } from "./shapes";

export class ShapeFactory {

    static createShape(node: Konva.Node, state?: ShapeState): Shape {
        const shapeMapping: Record<ShapeType, (shape: Konva.Shape) => Shape> = {
            "LINE": (shape) => new Line(shape as Konva.Line, state),
            "RECTANGLE": (shape) => new Rectangle(shape as Konva.Rect, state),
            "POLYGON": (shape) => new Polygon(shape as Konva.Line, state)
        };

        return shapeMapping[node.name() as ShapeType](node as Konva.Shape);
    }

    static createKonvaShape(shape: ShapeData): Konva.Shape {
        const shapeMapping: Record<ShapeType, typeof Konva.Shape> = {
            "LINE": Konva.Line,
            "RECTANGLE": Konva.Rect,
            "POLYGON": Konva.Line
        };
        const type = shape.type;

        return new shapeMapping[type](
            {
                id: IdHelper.getId(),
                name: type,
                ...shape
            }
        );
    }
}