import Konva from 'konva';
import { LayerFacade } from './layer-facade';
import { SelectionHandler } from '../selection-handler';
import { createKonvaRect, createKonvaRects, createStage } from '../../testing/test.utils';
import { ShapeService } from './shape.service';
import { StateManager } from '../state-manager';
import { ShapeCollection } from './shape.collection';
jest.mock('../selection-handler');
jest.mock('./shape.service');

let layer: Konva.Layer;
let facade: LayerFacade;
const shapeService = new ShapeService(new StateManager(), new ShapeCollection());
const selectionHandler = new SelectionHandler(createStage(), new Konva.Layer());

beforeEach(() => {
  (SelectionHandler as jest.Mock).mockClear();
  (ShapeService as jest.Mock).mockClear();

  layer = createLayer();
  facade = new LayerFacade(layer, shapeService, selectionHandler);
});

describe('LayerFacade', () => {
  it('add creates a shape on the layer', () => {
    const id = 'rect';
    facade.add(createKonvaRect(id));

    const node = layer.find('#rect');
    expect(node).toBeDefined();
  });

  it('add with several shapes adds all shapes to layer', () => {
    const expectedCount = 2;
    const rects = createKonvaRects(expectedCount);
    facade.add(...rects);

    const shapes = layer.find((node: Konva.Node) => node.id().startsWith('rect'));
    expect(shapes).toBeDefined();
    expect(shapes.length).toBe(expectedCount);
  });

  it('select calls ShapeService and SelectionHandler', () => {
    const rect = createKonvaRect('rect');
    facade.select(rect.id());

    expect(shapeService.select).toHaveBeenCalled();
    expect(shapeService.select).toHaveBeenCalledWith(rect.id());
    expect(selectionHandler.addToSelection).toHaveBeenCalled();
    expect(selectionHandler.addToSelection).toHaveBeenCalledWith(rect.id());
  });

  it('deleteSelected calls ShapeService', () => {
    facade.deleteSelected();
    expect(shapeService.deleteSelected).toHaveBeenCalled();
  });
});

function createLayer(): Konva.Layer {
  const layer = new Konva.Layer();
  return layer;
}
