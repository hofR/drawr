import { DrawingEditor } from "./drawing-editor";
import { Tool } from "./drawing-mode";

describe("init tests", () => {
    it("creation works", () => {
        const editor = createEditor();
        expect(editor).toBeDefined();
    })
})

describe("changeTool", () => {
    it("changes active tool", () => {
        const editor = createEditor();

        expect(editor.activeTool).toBe(undefined);

        let tool = Tool.LINE
        editor.changeTool(tool)
        expect(editor.activeTool).toBe(tool);
    })

    it("disables drag and selection", () => {
        const editor = createEditor();
        let tool = Tool.LINE
        editor.changeTool(tool)

        expect(editor.isDragEnabled).toBe(false);
        expect(editor.isSelectionEnabled).toBe(false);
    })
})


describe("selection", () => {
    it("enable/disable", () => {
        const editor = createEditor();
        expect(editor.isSelectionEnabled).toBe(false);

        editor.enableSelection();
        expect(editor.isSelectionEnabled).toBe(true);

        editor.disableSelection()
        expect(editor.isSelectionEnabled).toBe(false);
    })

    it("enable resets tool", () => {
        const editor = createEditor();
        editor.changeTool(Tool.LINE);

        editor.enableSelection();
        expect(editor.activeTool).toBeUndefined();
    })
})

describe("drag", () => {
    it("enable/disable", () => {
        const editor = createEditor();
        expect(editor.isDragEnabled).toBe(false);

        editor.enableDrag();
        expect(editor.isDragEnabled).toBe(true);

        editor.disableDrag()
        expect(editor.isDragEnabled).toBe(false);
    })

    it("enable resets tool", () => {
        const editor = createEditor();
        editor.changeTool(Tool.LINE);

        editor.enableDrag();
        expect(editor.activeTool).toBeUndefined();
    })
})



function createEditor(): DrawingEditor {
    document.body.innerHTML = '<div id="container"></div>'
    return new DrawingEditor('container', 200, 200);
}
