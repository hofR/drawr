import Konva from "konva";
import { ShapeDataMapper } from "./mapper";

export interface ShapeConfig {
    fill?: string,
    stroke?: string,
    strokeWidth?: number
}

export interface ShapeData extends ShapeConfig {
    type: ShapeType
    fill: string,
    stroke: string,
    strokeWidth: number
}

export type ShapeType = 'RECTANGLE' | 'LINE' | 'POLYGON';

/**
 * Proxy object to encapsulate access to Konva.Shape outside of the library
 */
export class Shape<KonvaShape extends Konva.Shape = Konva.Shape> {

    constructor(
        protected readonly shape: KonvaShape
    ) { }

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

    delete(): void {
        this.shape.destroy();
    }

    updateConfig(config: ShapeConfig): void {
        this.fill = config.fill ?? this.shape.fill();
        this.stroke = config.stroke ?? this.shape.stroke();
        this.strokeWidth = config.strokeWidth ?? this.shape.strokeWidth();
    }

    toData(): ShapeData {
        return new ShapeDataMapper().map(this);
    }
}
