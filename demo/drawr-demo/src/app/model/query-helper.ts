import Konva from "konva";
import { Shape } from "./shapes";
import { ShapeFactory } from "./shape.factory";

export class QueryHelper {

    constructor(private readonly layer: Konva.Layer) { }

    findAll(): Shape[] {
        return this.layer
            .find((node: Konva.Node) => node.id().startsWith('drawr'))
            .map(ShapeFactory.createShape);
    }

    findById(ids: string[]): Shape[] {
        return this.layer
            .find((node: Konva.Node) => ids.includes(node.id()))
            .map(ShapeFactory.createShape);
    }
}