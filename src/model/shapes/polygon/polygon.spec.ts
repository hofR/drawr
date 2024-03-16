import Konva from "konva"
import { Polygon } from "./polygon"
import { ShapeType } from "../shape.type"

describe("mapToData tests", () => {
    it("data is correctly mapped", () => {
        const type: ShapeType = 'POLYGON'
        const points = [0, 1, 2, 3, 4, 5];

        const konvaLine = new Konva.Line({
            type, points
        })
        const polygon = new Polygon(konvaLine);
        const data = polygon.mapToData()

        expect(data.points).toBe(points);
        expect(data.closed).toBe(true);
    })
})