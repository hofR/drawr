import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { DrawingEditor } from 'drawr';
import { DrawingMode } from 'drawr';
import { ShapeData } from 'drawr';
import { Shape } from 'drawr';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'drawr-demo';
  editor?: DrawingEditor;
  DrawerType = DrawingMode;
  shapes?: ShapeData[];
  layers: string[] = [];

  ngOnInit(): void {
    this.initKonva();
  }

  initKonva() {
    this.editor = new DrawingEditor('container', window.innerWidth, window.innerHeight);
    this.editor.onLogMessage = (message: string) => {
      console.log(message);
    };
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
  }

  onDelete() {
    this.editor?.deleteSelected();
  }

  onClear() {
    this.editor?.clear();
  }

  export() {
    this.shapes = this.editor?.export();
  }

  import() {
    console.log(this.shapes);
    this.editor?.import(this.shapes ?? []);
  }

  undo() {
    this.editor?.undo();
  }

  redo() {
    this.editor?.redo();
  }

  addLayer() {
    this.editor?.addLayer(true);
    this.layers = this.editor?.getLayers() ?? [];
  }

  onSelectionChange($event: Event) {
    const target = $event.target as HTMLInputElement;
    console.log(target.value);
    this.editor?.activateLayer(target.value);
  }

  hideLayer(): void {
    this.editor?.hideLayer();
  }

  showLayer(): void {
    this.editor?.showLayer();
  }

  show(): void {
    this.editor?.show();
  }

  hide(): void {
    this.editor?.hide();
  }

  deleteLayer(): void {
    this.editor?.removeLayer();
  }
}
