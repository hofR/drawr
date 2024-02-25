import Konva from "konva";
import { Shape, ShapeType } from "./shape";

export abstract class ShapeFactory<KonvaShape extends Konva.Shape = Konva.Shape, S extends Shape = Shape> {
    private static id: number = 0;

    abstract shapeType: ShapeType;

    abstract fromKonva(shape: KonvaShape): S;
    abstract toKonva(shape: Partial<S>): KonvaShape;

    protected createKonvaShape(shape: KonvaShape): KonvaShape {
        shape.id(this.getId());
        shape.addName(this.getType());

        return shape;
    }

    private getId(): string {
        return `drawr-${ShapeFactory.id++}`;
    }

    private getType(): string {
        return this.shapeType;
    }
}