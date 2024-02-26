import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { DrawingEditor } from './model/drawing-editor';
import { DrawingMode } from './model/drawing-mode';
import { ShapeData } from './model/shapes/shape';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'drawr-demo';
  editor?: DrawingEditor;
  DrawerType = DrawingMode;
  shapes?: ShapeData[];
  selected: string[] = [];

  ngOnInit(): void {
    this.initKonva()
  }

  initKonva() {
    this.editor = new DrawingEditor('container', window.innerWidth, window.innerHeight);
    this.editor.onSelect = (ids) => {this.selected = ids}
  }

  changeTool(type: DrawingMode) {
    this.editor?.changeTool(type);
  }

  disableDrag() {
    this.editor?.disableDrag();
  }

  enableDrag() {
    this.editor?.enableDrag();
  }

  enableSelect() {
    this.editor?.enableSelection();
  }

  disableSelect() {
    this.editor?.disableSelection();
  }

  onStrokeChanged(event: Event) {
    const color = (event.target as HTMLInputElement).value;
    this.editor?.changeStroke(color);
  }

  onColorChanged(event: Event) {
    const color = (event.target as HTMLInputElement).value;
    this.editor?.changeFill(color);

    if(this.selected.length > 0) {
      this.editor?.updateShapeConfig({fill: color}, ...this.selected)
    }
  }

  onDelete() {
    this.editor?.deleteSelected();
  }

  export() {
    this.shapes = this.editor?.export();
 }

  import() {
    this.editor?.import(this.shapes ?? []);
  }

  undo() {
    this.editor?.undo();
  }

  redo() {
    this.editor?.redo();
  }
}
