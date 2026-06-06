import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompareResponse } from '../../core/models/comparison.models';

@Component({
  selector: 'app-stats-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
<div class="stats-bar">
  <div class="stats-inner">
    <div class="stat-card">
      <div class="stat-icon stat-icon--items">
        <i class="ti ti-shopping-cart" aria-hidden="true"></i>
      </div>
      <div class="stat-info">
        <div class="stat-val">{{ response.extractedItems.length }}</div>
        <div class="stat-label">Items found</div>
      </div>
    </div>

    <div class="stat-card">
      <div class="stat-icon stat-icon--platforms">
        <i class="ti ti-building-store" aria-hidden="true"></i>
      </div>
      <div class="stat-info">
        <div class="stat-val">{{ platformCount }}</div>
        <div class="stat-label">Platforms checked</div>
      </div>
    </div>

    <div class="stat-card">
      <div class="stat-icon stat-icon--savings">
        <i class="ti ti-trending-down" aria-hidden="true"></i>
      </div>
      <div class="stat-info">
        <div class="stat-val stat-val--green">₹{{ bestSaving | number:'1.0-0' }}</div>
        <div class="stat-label">Max savings</div>
      </div>
    </div>

    <div class="stat-card">
      <div class="stat-icon stat-icon--time">
        <i class="ti ti-bolt" aria-hidden="true"></i>
      </div>
      <div class="stat-info">
        <div class="stat-val">{{ response.processingTimeMs }}<span class="stat-unit">ms</span></div>
        <div class="stat-label">Scan time</div>
      </div>
    </div>

    <div class="stat-card" *ngIf="response.notFoundItems.length">
      <div class="stat-icon stat-icon--notfound">
        <i class="ti ti-search-off" aria-hidden="true"></i>
      </div>
      <div class="stat-info">
        <div class="stat-val stat-val--warn">{{ response.notFoundItems.length }}</div>
        <div class="stat-label">Not found</div>
      </div>
    </div>
  </div>
</div>
  `,
  styles: [`
    .stats-bar {
      background: var(--color-background-primary);
      border-bottom: 1px solid var(--color-border-tertiary);
      padding: 16px 24px;
    }
    .stats-inner {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }
    .stat-card {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 16px;
      background: var(--color-background-secondary);
      border-radius: var(--border-radius-md);
      border: 1px solid var(--color-border-tertiary);
      flex: 1;
      min-width: 140px;
      transition: all var(--transition-fast);
    }
    .stat-card:hover {
      border-color: var(--color-border-secondary);
      box-shadow: var(--shadow-sm);
    }
    .stat-icon {
      width: 36px;
      height: 36px;
      border-radius: var(--border-radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      flex-shrink: 0;
    }
    .stat-icon--items {
      background: #EBF5FF;
      color: #2563EB;
    }
    .stat-icon--platforms {
      background: #F3E8FF;
      color: #7C3AED;
    }
    .stat-icon--savings {
      background: #ECFDF5;
      color: #16A34A;
    }
    .stat-icon--time {
      background: #FFF0E0;
      color: #FC8019;
    }
    .stat-icon--notfound {
      background: #FEF3C7;
      color: #D97706;
    }
    .stat-info {
      min-width: 0;
    }
    .stat-val {
      font-size: 20px;
      font-weight: 700;
      line-height: 1.2;
      color: var(--color-text-primary);
    }
    .stat-val--green {
      color: #16A34A;
    }
    .stat-val--warn {
      color: #D97706;
    }
    .stat-unit {
      font-size: 12px;
      font-weight: 400;
      color: var(--color-text-secondary);
      margin-left: 2px;
    }
    .stat-label {
      font-size: 11px;
      color: var(--color-text-secondary);
      font-weight: 500;
      margin-top: 1px;
    }
    @media (max-width: 640px) {
      .stats-bar {
        padding: 12px 16px;
      }
      .stat-card {
        min-width: calc(50% - 6px);
        padding: 10px 12px;
      }
      .stat-val {
        font-size: 17px;
      }
    }
  `]
})
export class StatsBarComponent {
  @Input() response!: CompareResponse;

  get platformCount(): number {
    const platforms = new Set(
      this.response.comparisons.flatMap(c => c.prices.map(p => p.platform))
    );
    return platforms.size;
  }

  get bestSaving(): number {
    return this.response.baskets.reduce((best, basket) => {
      const saving = basket.items.reduce((s, item) => {
        if (!item.available || !item.mrp || !item.price) return s;
        return s + Math.max(0, item.mrp - item.price);
      }, 0);
      return Math.max(best, saving);
    }, 0);
  }
}
