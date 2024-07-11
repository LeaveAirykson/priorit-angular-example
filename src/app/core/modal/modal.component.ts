import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

/**
 * A reusable modal component. Its visibility should be controled
 * inside parent container, which also should listen to closing event
 * to change its visibility dynamically. Its recommended to set
 * its max width to keep the container small.
 *
 * @example
 * <app-modal *ngIf="showModal" maxWidth="800px" (closing)="showModal=false">
 *   This is the content inside the modal
 * </app-modal>
 */
@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit, OnDestroy {
  @Output() closing: EventEmitter<boolean> = new EventEmitter();
  @Input() classes: string = '';
  @Input() maxWidth: string | number = '95%';

  /**
   * Emits closing event for parent components to react to.
   *
   * @fires ModalComponent#closing
   * @return {void}
   */
  close() {
    this.closing.emit(true);
  }

  ngOnInit(): void {
    document.addEventListener('keydown', this.onKeydown.bind(this))
  }

  /**
   * Event handler for catching escape key to
   * trigger ModalComponent.close()
   *
   * @param  {KeyboardEvent} event
   *
   * @return {void}
   */
  onKeydown(event: KeyboardEvent) {
    event.key == 'Escape' && this.close();
  }

  ngOnDestroy(): void {
    document.removeEventListener('keydown', this.onKeydown);
  }
}
