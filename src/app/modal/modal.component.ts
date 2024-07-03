import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit, OnDestroy {
  @Output() closing: EventEmitter<boolean> = new EventEmitter();
  @Input() classes: string = '';
  @Input() maxWidth: string | number = '95%';

  close() {
    console.log('should close');
    this.closing.emit(true);
  }

  ngOnInit(): void {
    console.log('modal init');
    document.addEventListener('keydown', this.onKeydown.bind(this))
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key == 'Escape') {
      this.close();
    }
  }

  ngOnDestroy(): void {
    console.log('modal destroy');
    document.removeEventListener('keydown', this.onKeydown);
  }
}
