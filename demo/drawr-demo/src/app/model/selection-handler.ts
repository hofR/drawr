import Konva from 'konva';

/**
 * Stolen from https://konvajs.org/docs/select_and_transform/Basic_demo.html
 */
export class SelectionHandler {
    onSelect?: (ids: string[]) => void;

    private selecting = false;
    private readonly selectionRectangle = new Konva.Rect({
        fill: 'rgba(0,0,255,0.5)',
        visible: false,
        name: 'selectionRectangle'
    });
    private readonly transformer = new Konva.Transformer({ name: 'selectionTransformer' });

    private x1?: number;
    private x2?: number;
    private y1?: number;
    private y2?: number;

    constructor(
        private readonly stage: Konva.Stage,
        private readonly layer: Konva.Layer
    ) {
        this.setup();
    }

    public dispose(): void {
        this.updateSelection([]);

        this.layer
            .findOne((node: Konva.Node) => node.hasName(this.selectionRectangle.name()))
            ?.remove();
        this.layer
            .findOne((node: Konva.Node) => node.hasName(this.transformer.name()))
            ?.remove;

        this.stage.removeEventListener('mousedown touchstart');
        this.stage.removeEventListener('mousemove touchmove');
        this.stage.removeEventListener('mouseup touchend');
        this.stage.removeEventListener('click tap');
    }

    public setup(): void {
        this.layer.add(this.selectionRectangle);
        this.layer.add(this.transformer);

        this.stage.on('mousedown touchstart', (event) => this.handleMouseDown(event));
        this.stage.on('mousemove touchmove', (event) => this.handleMouseMove(event));
        this.stage.on('mouseup touchend', (event) => this.handleMouseUp(event));
        this.stage.on('click tap', (event) => this.handleClick(event));
    }

    public updateSelection(nodes: Konva.Node[]): string[] {
        this.transformer.nodes(nodes);
        const selectedIds = this.getSelectedIds();
        this.fireOnSelect();

        return selectedIds;
    }

    public getSelectedIds(): string[] {
        return this.transformer.nodes().map((node) => node.id());
    }

    protected handleMouseDown(mouseEvent: Konva.KonvaEventObject<MouseEvent>): void {
        // do nothing if we mousedown on any shape
        if (mouseEvent.target !== this.stage) {
            return;
        }
        mouseEvent.evt.preventDefault();
        this.x1 = this.stage.getPointerPosition()?.x;
        this.y1 = this.stage.getPointerPosition()?.y;
        this.x2 = this.stage.getPointerPosition()?.x;
        this.y2 = this.stage.getPointerPosition()?.y;

        this.selectionRectangle.width(0);
        this.selectionRectangle.height(0);
        this.selecting = true;
    }

    protected handleMouseUp(mouseEvent: Konva.KonvaEventObject<MouseEvent>): void {
        // do nothing if we didn't start selection
        this.selecting = false;
        if (!this.selectionRectangle.visible()) {
            return;
        }
        mouseEvent.evt.preventDefault();
        // update visibility in timeout, so we can check it in click event
        this.selectionRectangle.visible(false);
        const shapes = this.stage.getChildren();
        const box = this.selectionRectangle.getClientRect();
        const selected = shapes.filter((shape) =>
            Konva.Util.haveIntersection(box, shape.getClientRect())
        );
        this.transformer.nodes(selected);
    }


    protected handleMouseMove(mouseEvent: Konva.KonvaEventObject<MouseEvent>): void {
        // do nothing if we didn't start selection
        if (!this.selecting) {
            return;
        }
        mouseEvent.evt.preventDefault();
        this.x2 = this.stage.getPointerPosition()?.x;
        this.y2 = this.stage.getPointerPosition()?.y;

        this.selectionRectangle.setAttrs({
            visible: true,
            x: Math.min(this.x1!, this.x2!),
            y: Math.min(this.y1!, this.y2!),
            width: Math.abs(this.x2! - this.x1!),
            height: Math.abs(this.y2! - this.y1!),
        });
    }

    protected handleClick(mouseEvent: Konva.KonvaEventObject<MouseEvent>): void {
        // if we are selecting with rect, do nothing
        if (this.selectionRectangle.visible()) {
            return;
        }

        // if click on empty area - remove all selections
        if (mouseEvent.target === this.stage) {
            this.transformer.nodes([]);
            return;
        }

        // do we pressed shift or ctrl?
        const metaPressed = mouseEvent.evt.shiftKey || mouseEvent.evt.ctrlKey || mouseEvent.evt.metaKey;
        const isSelected = this.transformer.nodes().indexOf(mouseEvent.target) >= 0;

        if (!metaPressed && !isSelected) {
            // if no key pressed and the node is not selected
            // select just one
            this.transformer.nodes([mouseEvent.target]);
        } else if (metaPressed && isSelected) {
            // if we pressed keys and node was selected
            // we need to remove it from selection:
            const nodes = this.transformer.nodes().slice(); // use slice to have new copy of array
            // remove node from array
            nodes.splice(nodes.indexOf(mouseEvent.target), 1);
            this.transformer.nodes(nodes);
        } else if (metaPressed && !isSelected) {
            // add the node into selection
            const nodes = this.transformer.nodes().concat([mouseEvent.target]);
            this.transformer.nodes(nodes);
        }

        this.fireOnSelect();
    }

    private fireOnSelect(): void {
        if (this.onSelect) {
            this.onSelect(this.getSelectedIds());
        }
    }
}