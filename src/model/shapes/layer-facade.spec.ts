import Konva from 'konva';
import { LayerFacade } from './layer-facade';
import { SelectionHandler } from '../selection-handler';
import { createKonvaRect, createStage } from '../../testing/test.utils';
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

function createLayer(): Konva.Layer {
  const layer = new Konva.Layer();
  return layer;
}
