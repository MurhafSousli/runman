import {Component, OnInit, Input, ChangeDetectionStrategy} from '@angular/core';
import {Index} from "../../models";
import {GridService} from "../../service/grid.service";

@Component({
  selector: 'point',
  templateUrl: './point.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PointComponent implements OnInit {

  @Input() index: Index;
  @Input() color: string;

  constructor(private grid: GridService) { }

  ngOnInit() {
  }

}
