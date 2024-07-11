import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { DemoToolbarComponent } from './core/demo-toolbar/demo-toolbar.component';
import { NotificationAreaComponent } from './core/notification-area/notification-area.component';
import { ModalComponent } from './core/modal/modal.component';
import { SortableDirective } from './core/directives/sortable.directive';
import { SortbyDirective } from './core/directives/sortby.directive';
import { ChartComponent } from './core/chart/chart.component';
import { BookListComponent } from './book/book-list/book-list.component';
import { BookFormComponent } from './book/book-form/book-form.component';
import { BookHomeComponent } from './book/book-home/book-home.component';
import { BookChartComponent } from './book/book-chart/book-chart.component';
import { BookFilterFormComponent } from './book/book-filter-form/book-filter-form.component';
import { RemunerationPipe } from './book/pipes/remuneration.pipe';


@NgModule({
  declarations: [
    AppComponent,
    BookListComponent,
    BookFormComponent,
    BookHomeComponent,
    RemunerationPipe,
    DemoToolbarComponent,
    NotificationAreaComponent,
    ModalComponent,
    SortableDirective,
    SortbyDirective,
    ChartComponent,
    BookChartComponent,
    BookFilterFormComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
