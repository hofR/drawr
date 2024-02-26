import Konva from "konva";
import { Line, Polygon, Rectangle, Shape, ShapeType } from "./shapes";

export class QueryHelper {

    constructor(private readonly layer: Konva.Layer) {}

    findAll(): Shape[] {
        return this.layer
        .find((node: Konva.Node) => node.id().startsWith('drawr'))
        .map(this.mapToShape);
    }

    findById(ids: string[]): Shape[] {
        return this.layer
        .find((node: Konva.Node) => ids.includes(node.id()))
        .map(this.mapToShape);
    }

    private mapToShape(node: Konva.Node): Shape {
        const dict: Record<ShapeType, typeof Shape<Konva.Shape>> = {
            "LINE": Line,
            "RECTANGLE": Rectangle,
            "POLYGON": Polygon
        };

        return new dict[node.name() as ShapeType](node as Konva.Shape);
    }
}