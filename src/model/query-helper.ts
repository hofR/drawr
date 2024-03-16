import Konva from "konva";
import { Shape } from "./shapes";
import { ShapeFactory } from "./shape.factory";

export class QueryHelper {

    constructor(private readonly layer: Konva.Layer) { }

    findAll(): Shape[] {
        return this.layer
            .find((node: Konva.Node) => node.id().startsWith('drawr'))
            .map(node => ShapeFactory.createShape(node));
    }

    findById(ids: string[]): Shape[] {
        return this.layer
            .find((node: Konva.Node) => ids.includes(node.id()))
            .map(node => ShapeFactory.createShape(node));
    }

    findAllSelected(): Shape[] {
        return this
            .findAll()
            .filter(shape => shape.selected);
    }
}