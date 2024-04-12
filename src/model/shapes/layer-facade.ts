import Konva from 'konva';
import { logging } from '../logging/logger';
import { SelectionHandler } from '../selection-handler';
import { ShapeFactory } from '../shape.factory';
import { Shape } from './shape';
import { ShapeConfig } from './shape.config';
import { ShapeData } from './shape.data';
import { ShapeService } from './shape.service';

/**
 * Facade to encapsulate access to Konva.Layer
 */
export class LayerFacade {
  private readonly logger = logging.createLogger('LayerFacade');

  constructor(
    private readonly layer: Konva.Layer,
    private readonly shapeService: ShapeService,
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
    this.shapeService.add(...shapes.map((shape) => ShapeFactory.createShape(shape)));
  }

  remove(...ids: string[]): void {
    this.logger.debug(`delete ${ids}`);
    this.shapeService.delete(...ids);
  }

  /**
   * Deletes all shapes that are currently selected
   */
  deleteSelected() {
    this.logger.debug(`deleteSelected`);
    //this.selectionHandler?.updateSelectionById(...selected.map((shape) => shape.id));
    this.shapeService.deleteSelected();
  }

  /**
   * Deletes all shapes on the layer and resets active selections
   */
  clear(): void {
    this.logger.debug('clear');
    this.shapeService.clear();
    this.selectionHandler.clearSelection();
  }

  private updateSelection(...ids: string[]): void {
    this.shapeService.updateSelection(...ids);
  }

  /**
   * Enables drag for all shapes on the layer
   */
  enableDrag(): void {
    this.logger.debug('enableDrag');
    this.shapeService.enableDrag();
  }

  /**
   * Disables drag for all shapes on the layer
   */
  disableDrag(): void {
    this.logger.debug('disableDrag');
    this.shapeService.disableDrag();
  }

  /**
   * Enables selection of shapes on the layer
   */
  enableSelection() {
    this.logger.debug('enableSelection');
    this.selectionHandler?.setup();
  }

  export(): ShapeData[] {
    return this.shapeService.export();
  }

  /**
   * Disables selection of shapes on the layer
   */
  disableSelection() {
    this.logger.debug('disableSelection');
    this.selectionHandler?.dispose();
  }

  updateShapeConfig(config: ShapeConfig, ...ids: string[]): void {
    this.shapeService.updateConfig(config, ...ids);
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

  select(...ids: string[]): void {
    this.shapeService.select(...ids);
    this.selectionHandler.addToSelection(...ids);
  }
}
