import Konva from 'konva';
import { Logger, logging } from '../logging/logger';
import { ShapeConfig } from './shape.config';
import { ShapeData } from './shape.data';
import { ShapeType } from './shape.type';

/**
 * Proxy object to encapsulate access to Konva.Shape outside of the library
 */
export abstract class Shape<KonvaShape extends Konva.Shape = Konva.Shape, Data extends ShapeData = ShapeData> extends EventTarget {
  private isSelected = false;
  private isDestroyed = false;
  private logger: Logger;

  constructor(protected readonly shape: KonvaShape) {
    super();
    this.logger = logging.createLogger(this.id);
  }

  protected abstract mapToData(): Data;

  get id(): string {
    return this.shape.id();
  }

  get type(): ShapeType {
    return this.shape.name() as ShapeType;
  }

  get x(): number {
    return this.shape.x();
  }

  get y(): number {
    return this.shape.y();
  }

  get width(): number {
    return this.shape.width();
  }

  get height(): number {
    return this.shape.height();
  }

  get visible(): boolean {
    return this.shape.visible();
  }

  set visible(visible: boolean) {
    this.shape.visible(visible);
  }

  get draggable(): boolean {
    return this.shape.draggable();
  }

  set draggable(draggable: boolean) {
    this.shape.draggable(draggable);
  }

  get fill(): string {
    return this.shape.fill();
  }

  set fill(fill: string) {
    this.shape.fill(fill);
  }

  get stroke(): string {
    return this.shape.stroke();
  }

  set stroke(stroke: string) {
    this.shape.stroke(stroke);
  }

  get strokeWidth(): number {
    return this.shape.strokeWidth();
  }

  set strokeWidth(strokeWidth: number) {
    this.shape.strokeWidth(strokeWidth);
  }

  get selected(): boolean {
    return this.isSelected;
  }

  select() {
    this.isSelected = true;
  }

  deselect() {
    this.isSelected = false;
  }

  delete(): void {
    this.logger.debug(`Destroying shape: ${this.id}`);
    if (this.isDestroyed) {
      const message = `Shape ${this.id} was already deleted`;
      this.logger.error(message);
      throw new Error(message);
    } else {
      this.isDestroyed = true;
      this.shape.destroy();
      this.deselect();
    }
  }

  updateConfig(config: ShapeConfig): void {
    this.fill = config.fill ?? this.shape.fill();
    this.stroke = config.stroke ?? this.shape.stroke();
    this.strokeWidth = config.strokeWidth ?? this.shape.strokeWidth();
  }

  toData(): Data {
    return this.mapToData();
  }

  protected shapeData: ShapeData = {
    type: this.type,
    fill: this.fill,
    stroke: this.stroke,
    strokeWidth: this.strokeWidth,
  };
}
