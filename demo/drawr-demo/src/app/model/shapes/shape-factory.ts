import Konva from "konva";
import { Shape } from "./shape";

export abstract class ShapeFactory {
    abstract fromKonva(shape: Konva.Shape): Shape;
    abstract toKonva(shape: Shape): Konva.Shape;
}