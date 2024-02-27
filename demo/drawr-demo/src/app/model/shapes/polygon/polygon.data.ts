import { ShapeData } from "../shape.data";


export interface PolygonData extends ShapeData {
    points: number[];
    closed: boolean;
}
