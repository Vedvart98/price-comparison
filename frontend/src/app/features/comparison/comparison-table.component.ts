import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemComparison, PLATFORM_COLORS } from '../../core/models/comparison.models';
import { InrPipe } from '../../shared/pipes/inr.pipe';
import { PlatformNamePipe } from '../../shared/pipes/platform-name.pipe';

@Component({
  selector: 'app-comparison-table',
  standalone: true,
  imports: [CommonModule, InrPipe, PlatformNamePipe],
  template: `
<section class="bd-section">
  <div class="bd-inner">
    <div class="section-head">
      <h2 class="section-title">Price breakdown by item</h2>
      <span class="section-sub">Compare prices across all platforms side-by-side</span>
    </div>

    <div class="bd-card" *ngFor="let cmp of comparisons">
      <!-- Card header -->
      <div class="bd-card-header">
        <div class="bd-item-info">
          <span class="bd-item-name">{{ cmp.item.normalized }}</span>
          <span class="bd-item-cat">{{ cmp.item.subcategory || cmp.item.category }}</span>
        </div>
        <div class="bd-best" *ngIf="cmp.bestPrice">
          <span class="bd-best-badge">
            <i class="ti ti-rosette-discount" aria-hidden="true"></i>
            Best: <strong>{{ cmp.bestPrice.price | inr }}</strong>
          </span>
          <span class="bd-best-on" [style.color]="platformColor(cmp.bestPrice.platform)">
            {{ cmp.bestPrice.platform | platformName }}
          </span>
        </div>
        <div class="bd-none" *ngIf="!cmp.availableAnywhere">
          <i class="ti ti-search-off" aria-hidden="true"></i>
          Not found on any platform
        </div>
      </div>

      <!-- Price rows -->
      <div class="bd-rows" *ngIf="cmp.prices.length">
        <div class="bd-row"
             *ngFor="let pp of cmp.prices"
             [class.bd-row--best]="pp === cmp.bestPrice"
             [class.bd-row--unavail]="!pp.available">
          <div class="bd-row-left">
            <span class="bd-dot" [style.background]="platformColor(pp.platform)"></span>
            <span class="bd-platform">{{ pp.platform | platformName }}</span>
            <span class="bd-product">{{ pp.productName }}</span>
            <span class="bd-unit">{{ pp.unit }}</span>
            <span class="bd-delivery">
              <i class="ti ti-clock" aria-hidden="true"></i>
              {{ pp.deliveryTime || '—' }}
            </span>
          </div>
          <div class="bd-row-right">
            <div class="bd-pricing" *ngIf="pp.available">
              <span class="bd-price">{{ pp.price | inr }}</span>
              <span class="bd-mrp" *ngIf="pp.mrp && pp.mrp > pp.price">{{ pp.mrp | inr }}</span>
              <span class="bd-disc" *ngIf="pp.discountPct > 0">{{ pp.discountPct | number:'1.0-0' }}% off</span>
            </div>
            <span class="bd-unavail" *ngIf="!pp.available">Out of stock</span>
            <a class="bd-link" *ngIf="pp.available && pp.productUrl"
               [href]="pp.productUrl" target="_blank" rel="noopener"
               [attr.aria-label]="'View on ' + pp.platform">
              <i class="ti ti-external-link" aria-hidden="true"></i>
            </a>
            <span class="bd-cheapest" *ngIf="pp === cmp.bestPrice">
              <i class="ti ti-star-filled" aria-hidden="true"></i>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
  `,
  styles: [`
    .bd-section {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }
    .bd-card {
      background: var(--color-background-primary);
      border: 1px solid var(--color-border-secondary);
      border-radius: var(--border-radius-lg);
      margin-bottom: 14px;
      overflow: hidden;
      transition: all var(--transition-fast);
      box-shadow: var(--shadow-sm);
    }
    .bd-card:hover {
      box-shadow: var(--shadow-md);
    }
    .bd-card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 20px;
      background: var(--color-background-secondary);
      border-bottom: 1px solid var(--color-border-tertiary);
      gap: 12px;
      flex-wrap: wrap;
    }
    .bd-item-info {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .bd-item-name {
      font-size: 15px;
      font-weight: 600;
      text-transform: capitalize;
    }
    .bd-item-cat {
      font-size: 11px;
      padding: 3px 10px;
      background: var(--color-primary-light);
      color: var(--color-primary-dark);
      border-radius: 10px;
      font-weight: 500;
    }
    .bd-best {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }
    .bd-best-badge {
      font-size: 13px;
      color: #16A34A;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .bd-best-badge .ti {
      font-size: 14px;
    }
    .bd-best-on {
      font-size: 12px;
      font-weight: 600;
    }
    .bd-none {
      font-size: 13px;
      color: var(--color-text-tertiary);
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .bd-rows {
      padding: 0;
    }
    .bd-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 20px;
      border-bottom: 1px solid var(--color-border-tertiary);
      font-size: 13px;
      transition: background var(--transition-fast);
    }
    .bd-row:last-child {
      border-bottom: none;
    }
    .bd-row:hover {
      background: var(--color-background-secondary);
    }
    .bd-row--best {
      background: #F0FDF4;
    }
    .bd-row--best:hover {
      background: #DCFCE7;
    }
    .bd-row--unavail {
      opacity: 0.4;
    }
    .bd-row-left {
      display: flex;
      align-items: center;
      gap: 10px;
      flex: 1;
      min-width: 0;
      flex-wrap: wrap;
    }
    .bd-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex-shrink: 0;
    }
    .bd-platform {
      font-weight: 600;
      font-size: 12px;
      min-width: 70px;
    }
    .bd-product {
      color: var(--color-text-secondary);
      font-size: 12px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 200px;
    }
    .bd-unit {
      font-size: 11px;
      color: var(--color-text-tertiary);
    }
    .bd-delivery {
      font-size: 11px;
      color: var(--color-text-secondary);
      display: flex;
      align-items: center;
      gap: 3px;
    }
    .bd-delivery .ti {
      font-size: 12px;
    }
    .bd-row-right {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-shrink: 0;
    }
    .bd-pricing {
      display: flex;
      align-items: baseline;
      gap: 6px;
    }
    .bd-price {
      font-weight: 700;
      font-size: 14px;
    }
    .bd-mrp {
      font-size: 11px;
      color: var(--color-text-tertiary);
      text-decoration: line-through;
    }
    .bd-disc {
      font-size: 11px;
      color: #16A34A;
      font-weight: 600;
    }
    .bd-unavail {
      font-size: 11px;
      color: var(--color-text-tertiary);
    }
    .bd-link {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      border: 1px solid var(--color-border-secondary);
      color: var(--color-text-secondary);
      text-decoration: none;
      transition: all var(--transition-fast);
    }
    .bd-link:hover {
      background: var(--color-primary);
      border-color: var(--color-primary);
      color: #fff;
    }
    .bd-cheapest {
      color: #16A34A;
      font-size: 16px;
    }
    @media (max-width: 768px) {
      .bd-section {
        padding: 16px;
      }
      .bd-product, .bd-unit, .bd-delivery {
        display: none;
      }
      .bd-row {
        padding: 10px 14px;
      }
      .bd-card-header {
        padding: 12px 14px;
      }
    }
  `]
})
export class ComparisonTableComponent {
  @Input() comparisons: ItemComparison[] = [];

  platformColor(p: string): string {
    return PLATFORM_COLORS[p?.toLowerCase()] ?? '#888';
  }
}
