import { Line, LineData } from "./line";
import { Polygon, PolygonData } from "./polygon";
import { Rectangle, RectangleData } from "./rectangle";
import { Shape, ShapeData } from "./shape";

export interface Mapper<Source, Destination> {
    map(source: Source): Destination
}

export class ShapeDataMapper implements Mapper<Shape, ShapeData> {
    map(source: Shape): ShapeData {
        return {
            type: source.type,
            fill: source.fill,
            stroke: source.stroke,
            strokeWidth: source.strokeWidth
        }
    }
}

export class RectangleDataMapper implements Mapper<Rectangle, RectangleData> {
    map(source: Rectangle): RectangleData {
        const shapeData = new ShapeDataMapper().map(source);
        return {
            x: source.x,
            y: source.y,
            width: source.width,
            height: source.height,
            ...shapeData
        };
    }
}

export class PolygonDataMapper implements Mapper<Polygon, PolygonData> {
    map(source: Polygon): PolygonData {
        const shapeData = new ShapeDataMapper().map(source);
        return {
            points: source.points,
            closed: true,
            ...shapeData
        };
    }
}

export class LineDataMapper implements Mapper<Line, LineData> {
    map(source: Line): LineData {
        const shapeData = new ShapeDataMapper().map(source);
        return {
            points: source.points,
            ...shapeData
        };
    }
}