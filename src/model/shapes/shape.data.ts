import { ShapeType } from "./shape.type";
import { ShapeConfig } from "./shape.config";

export interface ShapeData extends ShapeConfig {
    type: ShapeType;
    fill: string;
    stroke: string;
    strokeWidth: number;
}
