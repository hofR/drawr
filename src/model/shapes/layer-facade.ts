import Konva from 'konva';
import { Shape } from './shape';
import { ShapeFactory } from '../shape.factory';
import { Logger, logging } from '../logging/logger';
import { SelectionHandler } from '../selection-handler';

export class ShapeCollection {
  private readonly shapes: Shape[] = [];

  add(...shapes: Shape[]): void {
    this.shapes.push(...shapes);
  }

  remove(...shapes: Shape[]): void {
    shapes.forEach((toRemove) => {
      const index = this.shapes.findIndex((shape) => shape.id === toRemove.id);
      this.shapes.splice(index, 1);
    });
  }
}

/**
 * Facade to encapsulate access to Konva.Layer
 */
export class LayerFacade {
  private readonly shapes: Shape[] = [];
  private readonly logger = logging.createLogger('LayerFacade');

  constructor(
    private readonly layer: Konva.Layer,
    private readonly selectionHandler: SelectionHandler,
  ) {
    selectionHandler.onSelect = (selected) => {
      this.logger.debug('selectionHandler.onSelect: ' + selected);
      this.updateSelection(...selected);
    };
  }

  get id(): string {
    return this.layer.id();
  }

  add(...shapes: Konva.Shape[]) {
    this.logger.debug(`add ${shapes.map((s) => s.id())}`);
    this.layer.add(...shapes);
    this.shapes.push(...shapes.map((shape) => this.createShape(shape)));
  }

  /**
   * Deletes all shapes that are currently selected
   */
  deleteSelected() {
    const selected = this.findSelected();
    //this.selectionHandler?.updateSelectionById(...selected.map((shape) => shape.id));
    this.delete(...selected);
  }

  /**
   * Deletes all shapes on the layer and resets active selections
   */
  clear(): void {
    this.delete(...this.shapes);
    this.selectionHandler.clearSelection();
  }

  private delete(...shapes: Shape[]) {
    shapes.forEach((shape) => shape.delete());
  }

  private updateSelection(...ids: string[]): void {
    const selected = this.findById(ids);
    const unselected = this.shapes.filter((shape) => !ids.includes(shape.id));

    selected.forEach((shape) => shape.select());
    unselected.forEach((shape) => shape.deselect());
  }

  /**
   * Enables drag for all shapes on the layer
   */
  enableDrag(): void {
    this.logger.debug('enableDrag');
    this.shapes.forEach((shape) => (shape.draggable = true));
  }

  /**
   * Disables drag for all shapes on the layer
   */
  disableDrag(): void {
    this.logger.debug('disableDrag');
    this.shapes.forEach((shape) => (shape.draggable = false));
  }

  /**
   * Enables selection of shapes on the layer
   */
  enableSelection() {
    this.logger.debug('enableSelection');
    this.selectionHandler?.setup();
  }

  /**
   * Disables selection of shapes on the layer
   */
  disableSelection() {
    this.logger.debug('disableSelection');
    this.selectionHandler?.dispose();
  }

  findAll(): Shape[] {
    this.logger.debug('findAll');
    return this.shapes;
  }

  findSingleById(id: string): Shape | undefined {
    this.logger.debug('findSingleById');
    return this.shapes.find((shape) => shape.id === id);
  }

  findById(ids: string[]): Shape[] {
    this.logger.debug('findById');
    return this.shapes.filter((shape) => ids.includes(shape.id)) ?? [];
  }

  findSelected(): Shape[] {
    this.logger.debug('findSelected');
    return this.shapes.filter((shape) => shape.selected);
  }

  deactivate(): void {
    this.logger.debug('deactivate');
    this.disableSelection();
  }

  hide(): void {
    this.logger.debug('hide');
    this.layer.hide();
  }

  show(): void {
    this.logger.debug('show');
    this.layer.show();
  }

  destroy(): void {
    this.logger.debug('destroy');
    this.clear();
    this.deactivate();
    this.layer.destroy();
  }

  private remove(...shapes: Shape[]): void {
    shapes.forEach((toRemove) => {
      const index = this.shapes.findIndex((shape) => shape.id === toRemove.id);
      this.shapes.splice(index, 1);
    });
  }

  private createShape(node: Konva.Node): Shape {
    const shape = ShapeFactory.createShape(node);

    shape.on('delete', (event) => {
      this.logger.debug('shape.onDelete: ' + event.detail.shape.id);
      this.remove(event.detail.shape);
    });

    shape.on('selectionChange', (event) => {
      this.logger.debug('shape.onSelectionChange');
      this.selectionHandler.updateSelectionById(...this.findSelected().map((shape) => shape.id));
    });

    return shape;
  }
}
