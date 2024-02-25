import { Shape } from "../shape";

export interface Polygon extends Shape {
    points: number[];
    closed: boolean;
}
