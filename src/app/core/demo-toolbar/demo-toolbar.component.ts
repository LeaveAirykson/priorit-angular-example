import { Component } from '@angular/core';
import { DemoService } from '../services/demo.service';

/**
 * This component is not a practical use case, its just here
 * to ease the testing of the example application.
 */
@Component({
  selector: 'app-demo-toolbar',
  templateUrl: './demo-toolbar.component.html',
  styleUrls: ['./demo-toolbar.component.css']
})

export class DemoToolbarComponent {

  constructor(public demoService: DemoService) { }

  toggleValidateIsbnCheckSum(event: Event) {
    const val = (event.currentTarget as HTMLInputElement).checked;
    this.demoService.setOption('validateIsbnCheckSum', val);
  }

}
