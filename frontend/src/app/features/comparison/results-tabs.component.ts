import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompareResponse } from '../../core/models/comparison.models';
import { BasketsGridComponent } from '../baskets/baskets-grid.component';
import { ComparisonTableComponent } from './comparison-table.component';

type Tab = 'baskets' | 'breakdown';

@Component({
  selector: 'app-results-tabs',
  standalone: true,
  imports: [CommonModule, BasketsGridComponent, ComparisonTableComponent],
  template: `
<div class="tabs-container">
  <div class="tabs-bar">
    <button class="tab" [class.tab--active]="active === 'baskets'"
            (click)="active = 'baskets'">
      <i class="ti ti-shopping-bag" aria-hidden="true"></i>
      <span>Baskets</span>
    </button>
    <button class="tab" [class.tab--active]="active === 'breakdown'"
            (click)="active = 'breakdown'">
      <i class="ti ti-table" aria-hidden="true"></i>
      <span>Price breakdown</span>
    </button>
    <div class="tab-indicator" [style.transform]="active === 'baskets' ? 'translateX(0)' : 'translateX(100%)'"></div>
  </div>

  <div class="tab-content animate-fade-in" [class.tab-content--baskets]="active === 'baskets'">
    <app-baskets-grid *ngIf="active === 'baskets'"     [baskets]="response.baskets" />
    <app-comparison-table *ngIf="active === 'breakdown'" [comparisons]="response.comparisons" />
  </div>
</div>
  `,
  styles: [`
    .tabs-container {
      background: var(--color-background-secondary);
    }
    .tabs-bar {
      position: relative;
      display: flex;
      gap: 0;
      background: var(--color-background-primary);
      border-bottom: 1px solid var(--color-border-tertiary);
      padding: 0 24px;
      max-width: 1200px;
      margin: 0 auto;
    }
    .tab {
      position: relative;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 14px 20px;
      font-size: 14px;
      font-weight: 500;
      background: none;
      border: none;
      cursor: pointer;
      color: var(--color-text-secondary);
      transition: color var(--transition-fast);
      z-index: 1;
    }
    .tab:hover {
      color: var(--color-text-primary);
    }
    .tab--active {
      color: var(--color-primary);
    }
    .tab .ti {
      font-size: 18px;
    }
    .tab-indicator {
      display: none;
    }
    .tab-content {
      min-height: 400px;
    }
    @media (max-width: 640px) {
      .tabs-bar {
        padding: 0 16px;
      }
      .tab {
        padding: 12px 14px;
        font-size: 13px;
      }
      .tab span {
        display: none;
      }
    }
  `]
})
export class ResultsTabsComponent {
  @Input() response!: CompareResponse;
  active: Tab = 'baskets';
}
