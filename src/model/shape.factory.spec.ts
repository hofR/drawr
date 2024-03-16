import Konva from "konva";
import { ShapeFactory } from "./shape.factory"

it("createShape", () => {
    const rect = new Konva.Rect({
        name: "RECTANGLE"
    })

    const shape = ShapeFactory.createShape(rect);
    expect(shape.type).toBe('RECTANGLE')
})