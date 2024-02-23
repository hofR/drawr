import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { DrawingEditor } from './model/drawing-editor';
import { DrawingMode } from './model/drawing-mode';

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

  ngOnInit(): void {
    this.initKonva()
  }

  initKonva() {
    this.editor = new DrawingEditor('container', window.innerWidth, window.innerHeight);
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
}
