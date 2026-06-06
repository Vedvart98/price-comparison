import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Basket } from '../../core/models/comparison.models';
import { BasketCardComponent } from './basket-card.component';

@Component({
  selector: 'app-baskets-grid',
  standalone: true,
  imports: [CommonModule, BasketCardComponent],
  template: `
<section class="baskets-section">
  <div class="baskets-header">
    <div class="section-head">
      <h2 class="section-title">Recommended baskets</h2>
      <span class="section-sub">Pick the one that suits you best</span>
    </div>
    <div class="header-hint">
      <i class="ti ti-info-circle" aria-hidden="true"></i>
      Sorted by value
    </div>
  </div>
  <div class="baskets-grid">
    <app-basket-card *ngFor="let basket of baskets; let i = index"
      [basket]="basket"
      [style.animation-delay]="i * 0.1 + 's'"
    />
  </div>
</section>
  `,
  styles: [`
    .baskets-section {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }
    .baskets-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
    }
    .header-hint {
      font-size: 12px;
      color: var(--color-text-tertiary);
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .baskets-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
    }
    @media (max-width: 1024px) {
      .baskets-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    @media (max-width: 640px) {
      .baskets-section {
        padding: 16px;
      }
      .baskets-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }
      .baskets-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 4px;
      }
    }
  `]
})
export class BasketsGridComponent {
  @Input() baskets: Basket[] = [];
}
