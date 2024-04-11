import Konva from 'konva';
import { LayerFacade } from './layer-facade';
import { SelectionHandler } from '../selection-handler';
import { createKonvaRect, createKonvaRects, createStage } from '../../testing/test.utils';
jest.mock('../selection-handler');

let layer: Konva.Layer;
let facade: LayerFacade;

beforeEach(() => {
  (SelectionHandler as jest.Mock).mockClear();
  layer = createLayer();
  facade = new LayerFacade(layer, new SelectionHandler(createStage(), new Konva.Layer()));
});

describe('add', () => {
  it('creates a shape on the layer', () => {
    const id = 'rect';
    facade.add(createKonvaRect(id));

    const node = layer.find('#rect');
    expect(node).toBeDefined();
  });
});

describe('add and findAll', () => {
  it('returns correct number of shapes', () => {
    const expectedCount = 2;
    const rects = createKonvaRects(expectedCount);
    facade.add(...rects);

    const shapes = facade.findAll();
    expect(shapes).toBeDefined();
    expect(shapes.length).toBe(expectedCount);
  });
});

describe('select and findSelected', () => {
  it('returns selected shape', () => {
    const id = 'rect';
    const rect = createKonvaRect('rect');
    facade.add(rect);

    const shape = facade.findSingleById(id);
    shape?.select();

    const shapes = facade.findSelected();
    expect(shapes.length).toBe(1);
    expect(shapes[0].id).toBe(shape?.id);
  });
});

describe('deleteSelected', () => {
  it('deletes only selected shapes', () => {
    const rects = createKonvaRects(2);
    facade.add(...rects);
    const shapes = facade.findAll();
    shapes[0].select();
    const remainingShapeId = shapes[1].id;

    facade.deleteSelected();

    const shapesAfterDelete = facade.findAll();
    expect(shapesAfterDelete.length).toBe(1);
    expect(shapesAfterDelete[0].id).toBe(remainingShapeId);
  });
});

function createLayer(): Konva.Layer {
  const layer = new Konva.Layer();
  return layer;
}
