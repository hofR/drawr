
export interface ShapeConfig {
    fill: string,
    stroke: string,
    strokeWidth: number
}

export interface Shape extends ShapeConfig {
    type: ShapeType
    fill: string,
    stroke: string,
    strokeWidth: number
}

export type ShapeType = 'RECTANGLE' | 'LINE' | 'POLYGON';
