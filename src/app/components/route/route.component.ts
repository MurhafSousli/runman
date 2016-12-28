import {Component, OnInit, Input, ChangeDetectionStrategy} from '@angular/core';

@Component({
  selector: 'route',
  templateUrl: 'route.component.html',
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class RouteComponent implements OnInit {

  @Input() route;
  @Input() color;

  constructor() { }

  ngOnInit() {
  }

}
