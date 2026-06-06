import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompareRequest, CompareResponse } from './core/models/comparison.models';
import { ComparisonService } from './core/services/comparison.service';
import { SearchComponent } from './features/search/search.component';
import { ResultsTabsComponent } from './features/comparison/results-tabs.component';
import { StatsBarComponent } from './shared/components/stats-bar.component';
import { EmptyStateComponent } from './shared/components/empty-state.component';
import { ErrorBannerComponent } from './shared/components/error-banner.component';
import { NotFoundChipsComponent } from './shared/components/not-found-chips.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    SearchComponent,
    ResultsTabsComponent,
    StatsBarComponent,
    EmptyStateComponent,
    ErrorBannerComponent,
    NotFoundChipsComponent,
  ],
  template: `
<app-search (search)="onSearch($event)" />

<app-error-banner [message]="errorMsg" (dismissed)="errorMsg = null" />

<ng-container *ngIf="response">
  <app-not-found-chips [items]="response.notFoundItems" />
  <app-stats-bar [response]="response" />
  <app-results-tabs [response]="response" />
</ng-container>

<app-empty-state *ngIf="!response && !errorMsg" />
  `
})
export class HomeComponent {
  response: CompareResponse | null = null;
  errorMsg: string | null = null;

  constructor(private svc: ComparisonService) {}

  onSearch(req: CompareRequest) {
    this.errorMsg = null;
    this.response = null;
    this.svc.compare(req).subscribe({
      next: res  => this.response = res,
      error: err => this.errorMsg = err.message,
    });
  }
}
