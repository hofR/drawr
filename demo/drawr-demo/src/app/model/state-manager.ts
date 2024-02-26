import { ShapeData } from "./shapes/shape";

export class StateManager {
    private currentState: ShapeData[] = [];
    private stateStack: ShapeData[][] = [];
    private redoStack: ShapeData[][] = [];
    private readonly maxCount = 100;

    constructor() { }

    /**
     * Save an array of shapes as new state
     * 
     * - Drops the oldest state if limit is reached
     * - Resets the redo stack
     * 
     * @param state Array of shapes that represent the state
     */
    save(state: ShapeData[]): void {
        if (this.stateStack.length === this.maxCount) {
            //Drop the oldest element
            this.stateStack.shift();
        }

        //Add the current state
        this.stateStack.push(
            this.currentState
        );

        //Make the state of the canvas the current state
        this.currentState = state;

        //Reset the redo stack.
        //We can only redo things that were just undone.
        this.redoStack.length = 0;
    }

    /**
     * Restores the previous state
     * 
     * @returns the previous state or undefined if no state is stored 
     */
    undo(): ShapeData[] | undefined {
        if (!this.canUndo()) {
            return;
        }

        const newState = this.stateStack.pop();
        if (!newState) {
            return;
        }

        return this.applyState(this.redoStack, newState);
    }

    /**
     * 
     * @returns true if an action can be undone
     */
    canUndo(): boolean {
        return this.stateStack.length > 0;
    }

    /**
     * Reverses an undo action
     * 
     * @returns the new state or undefined if there is nothing to redo
     */
    redo(): ShapeData[] | undefined {
        if (!this.canRedo()) {
            return;
        }

        const newState = this.redoStack.pop();
        if (!newState) {
            return;
        }

        return this.applyState(this.stateStack, newState);
    }

    /**
     * 
     * @returns true if an action can be redone
     */
    canRedo(): boolean {
        return this.redoStack.length > 0;
    }

    private applyState(stack: ShapeData[][], newState: ShapeData[]): ShapeData[] {
        //Push the current state
        stack.push(this.currentState);

        //Make the new state the current state
        this.currentState = newState;

        return this.currentState;
    }
}