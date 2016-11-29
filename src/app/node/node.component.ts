import {Component, OnInit, Input, Renderer, ElementRef, ChangeDetectionStrategy} from '@angular/core';
import {Node} from '../models/node.model';
import {GridService} from "../services/grid.service";

@Component({
  selector: 'node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NodeComponent implements OnInit {

  @Input('data') node: Node;

  constructor(private grid: GridService) {
  }

  ngOnInit() {
  }

  getStyle() {
    let styles = {
      left: this.node.index.x * this.grid.nodeSize + "px",
      top: this.node.index.y * this.grid.nodeSize + "px",
      width: this.grid.nodeSize + "px",
      height: this.grid.nodeSize + "px",
      background: this.node.image,
      backgroundColor: '#d6f5d6',
      backgroundRepeat: "no-repeat"
    };
    return styles;
  }

}
