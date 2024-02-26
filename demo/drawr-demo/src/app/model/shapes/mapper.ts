import Konva from "konva";
import { Line, LineData } from "./line";
import { Polygon, PolygonData } from "./polygon";
import { Shape, ShapeData, ShapeType} from "./shape";
import { IdHelper } from "../id-helper";

export interface Mapper<Source, Destination> {
    map(source: Source): Destination
}

export interface KonvaMapper<Source extends ShapeData = ShapeData, Destination extends Konva.Shape = Konva.Shape> extends Mapper<Source, Destination> { }

export class KonvaShapeMapper<Source extends ShapeData, Destination extends Konva.Shape> {
   static map<Source, Destination>(source: Source, destination: { new(config: Konva.ShapeConfig): Destination}, type: ShapeType): Destination {
        return new destination({
            id: IdHelper.getId(),
            name: type,
            ...source
        })
    }
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