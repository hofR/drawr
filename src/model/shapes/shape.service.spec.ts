import { createRectangle } from '../../testing/test.utils';
import { StateManager } from '../state-manager';
import { ShapeCollection } from './shape.collection';
import { ShapeService } from './shape.service';
jest.mock('./shape.collection');
jest.mock('../state-manager');

let service: ShapeService;
const shapeCollection = new ShapeCollection();
const stateManager = new StateManager();

beforeEach(() => {
  (ShapeCollection as jest.Mock).mockClear();
  service = new ShapeService(stateManager, shapeCollection);
});

describe('ShapeService', () => {
  describe('add', () => {
    it('calls add on shape collection', () => {
      service.add(createRectangle());
      expect(shapeCollection.add).toHaveBeenCalled();
      setTimeout(() => {
        expect(stateManager.save).toHaveBeenCalled();
      }, 10);
    });
  });

  describe('clear', () => {
    it('calls clear on shape collection', () => {
      service.clear();
      expect(shapeCollection.clear).toHaveBeenCalled();
      setTimeout(() => {
        expect(stateManager.save).toHaveBeenCalled();
      }, 10);
    });
  });

  describe('delete', () => {
    it('calls remove on shape collection', () => {
      service.delete();
      expect(shapeCollection.remove).toHaveBeenCalled();
      setTimeout(() => {
        expect(stateManager.save).toHaveBeenCalled();
      }, 10);
    });
  });

  it('deleteSelected', () => {
    service.deleteSelected();
    expect(shapeCollection.remove).toHaveBeenCalled();
    setTimeout(() => {
      expect(stateManager.save).toHaveBeenCalled();
    }, 10);
  });

  it('disableDrag', () => {
    service.disableDrag();
    expect(shapeCollection.forEach).toHaveBeenCalled();
  });
});
