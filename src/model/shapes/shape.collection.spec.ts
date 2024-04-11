import { createKonvaRect, createKonvaRects } from '../../testing/test.utils';
import { ShapeFactory } from '../shape.factory';
import { Shape } from './shape';
import { ShapeCollection } from './shape.collection';

let collection: ShapeCollection;

beforeEach(() => {
  collection = new ShapeCollection();
});

describe('add and get', () => {
  it('returns correct shape', () => {
    const shape = ShapeFactory.createShape(createKonvaRect('rect'));
    collection.add(shape);

    const shapes = collection.get();
    expect(shapes).toBeDefined();
    expect(shapes.length).toBe(1);
  });
});

describe('remove', () => {
  it('changes length of items', () => {
    const numberOfShapes = 20;
    const shapes = createShapeArray(numberOfShapes);
    collection.add(...shapes);

    const shapesToDelete = [shapes[2], shapes[4], shapes[8]];
    collection.remove(...shapesToDelete);

    const shapesAfterDelete = collection.get();
    expect(shapesAfterDelete).toBeDefined();
    expect(shapesAfterDelete.length).toBe(numberOfShapes - 3);
  });
});

describe('find', () => {
  it('returns the same result as Array.find()', () => {
    const shapeArray = createShapeArray();
    const idToFind = shapeArray[5].id;

    collection.add(...shapeArray);

    const predicate = (s: Shape) => s.id === idToFind;
    const shapeFromCollection = collection.find(predicate);
    const shapeFromArray = shapeArray.find(predicate);

    expect(shapeFromArray).toBeDefined();
    expect(shapeFromCollection).toBeDefined();
    expect(shapeFromCollection?.id).toBe(shapeFromArray?.id);
  });
});

describe('filter', () => {
  it('returns the same result as Array.filter()', () => {
    const shapeArray = createShapeArray();
    const idToFind = shapeArray[5].id;

    collection.add(...shapeArray);

    const predicate = (s: Shape) => s.id === idToFind;
    const shapesFromCollection = collection.filter(predicate);
    const shapesFromArray = shapeArray.filter(predicate);

    expect(shapesFromArray).toBeDefined();
    expect(shapesFromCollection).toBeDefined();
    expect(shapesFromCollection.length).toBe(shapesFromArray.length);
    expect(shapesFromCollection[0].id).toBe(shapesFromArray[0].id);
  });
});

function createShapeArray(count: number = 10): Shape[] {
  return createKonvaRects(count).map(ShapeFactory.createShape);
}
