import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Basket, PLATFORM_COLORS } from '../../core/models/comparison.models';
import { InrPipe } from '../../shared/pipes/inr.pipe';
import { PlatformNamePipe } from '../../shared/pipes/platform-name.pipe';
import { BasketItemComponent } from './basket-item.component';

const STRATEGY_CFG = {
  CHEAPEST:         { icon: 'ti-rosette-discount', label: 'Best Value', color: '#FC8019', gradient: 'linear-gradient(135deg, #FC8019, #FF5200)' },
  BALANCED:         { icon: 'ti-adjustments',      label: 'Smart Pick', color: '#8B5CF6', gradient: 'linear-gradient(135deg, #8B5CF6, #6D28D9)' },
  FEWEST_PLATFORMS: { icon: 'ti-shopping-bag',     label: 'One-Stop',   color: '#2563EB', gradient: 'linear-gradient(135deg, #2563EB, #1D4ED8)' },
};

@Component({
  selector: 'app-basket-card',
  standalone: true,
  imports: [CommonModule, InrPipe, PlatformNamePipe, BasketItemComponent],
  template: `
<article class="basket-card" [class.basket-card--featured]="basket.strategy === 'CHEAPEST'">
  <!-- Card visual header with gradient -->
  <div class="card-header" [style.background]="cfg.gradient">
    <div class="header-pattern"></div>
    <div class="header-badge">
      <i class="ti {{ cfg.icon }}" aria-hidden="true"></i>
      {{ cfg.label }}
    </div>
    <div class="header-title">{{ basket.title }}</div>
    <div class="header-desc">{{ basket.description }}</div>
  </div>

  <!-- Price & platforms row -->
  <div class="card-meta">
    <div class="meta-total">
      <span class="total-price">{{ basket.totalEstimate | inr }}</span>
      <span class="total-label">estimated total</span>
    </div>
    <div class="meta-savings" *ngIf="savings > 0">
      <i class="ti ti-trending-down" aria-hidden="true"></i>
      Save {{ savings | inr }}
    </div>
  </div>

  <!-- Platform pills -->
  <div class="platform-row">
    <span class="platform-pill" *ngFor="let p of basket.platforms"
          [style.--pill-color]="platformColor(p)">
      <span class="pill-dot" [style.background]="platformColor(p)"></span>
      {{ p | platformName }}
    </span>
  </div>

  <!-- Items list -->
  <div class="items-section">
    <div class="items-head">
      <span class="items-count">{{ basket.items.length }} item{{ basket.items.length > 1 ? 's' : '' }}</span>
      <span class="items-hint" *ngIf="basket.unavailableCount > 0">
        <i class="ti ti-alert-circle" aria-hidden="true"></i>
        {{ basket.unavailableCount }} unavailable
      </span>
    </div>
    <div class="items-list">
      <app-basket-item *ngFor="let item of basket.items" [item]="item" />
    </div>
  </div>

  <!-- View details CTA -->
  <div class="card-footer" *ngIf="basket.unavailableCount > 0">
    <i class="ti ti-alert-circle" aria-hidden="true"></i>
    {{ basket.unavailableCount }} item{{ basket.unavailableCount > 1 ? 's' : '' }} currently unavailable
  </div>
</article>
  `,
  styles: [`
    .basket-card {
      background: var(--color-background-primary);
      border: 1px solid var(--color-border-secondary);
      border-radius: var(--border-radius-lg);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transition: all var(--transition-base);
      animation: fadeInUp 0.4s ease forwards;
      box-shadow: var(--shadow-sm);
    }
    .basket-card:hover {
      box-shadow: var(--shadow-lg);
      transform: translateY(-2px);
    }
    .basket-card--featured {
      border-color: rgba(252, 128, 25, 0.3);
      box-shadow: 0 0 0 1px rgba(252, 128, 25, 0.15), var(--shadow-md);
    }
    .basket-card--featured:hover {
      box-shadow: 0 0 0 1px rgba(252, 128, 25, 0.2), var(--shadow-lg);
    }

    /* Header */
    .card-header {
      position: relative;
      padding: 20px 20px 18px;
      color: #fff;
      overflow: hidden;
    }
    .header-pattern {
      position: absolute;
      inset: 0;
      background: repeating-linear-gradient(
        45deg,
        transparent,
        transparent 20px,
        rgba(255,255,255,0.04) 20px,
        rgba(255,255,255,0.04) 40px
      );
    }
    .header-badge {
      position: relative;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      font-size: 11px;
      font-weight: 600;
      padding: 4px 12px;
      background: rgba(255,255,255,0.2);
      border-radius: 20px;
      margin-bottom: 10px;
      letter-spacing: 0.3px;
      text-transform: uppercase;
    }
    .header-badge .ti {
      font-size: 13px;
    }
    .header-title {
      position: relative;
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 4px;
      letter-spacing: -0.3px;
    }
    .header-desc {
      position: relative;
      font-size: 13px;
      opacity: 0.85;
      font-weight: 400;
    }

    /* Meta row */
    .card-meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 20px;
      background: var(--color-background-secondary);
      border-bottom: 1px solid var(--color-border-tertiary);
    }
    .meta-total {
      display: flex;
      align-items: baseline;
      gap: 8px;
    }
    .total-price {
      font-size: 22px;
      font-weight: 800;
      color: var(--color-text-primary);
      letter-spacing: -0.5px;
    }
    .total-label {
      font-size: 12px;
      color: var(--color-text-secondary);
      font-weight: 400;
    }
    .meta-savings {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 13px;
      font-weight: 600;
      color: #16A34A;
      padding: 4px 12px;
      background: #ECFDF5;
      border-radius: 20px;
    }
    .meta-savings .ti {
      font-size: 15px;
    }

    /* Platform row */
    .platform-row {
      display: flex;
      gap: 6px;
      padding: 10px 20px;
      flex-wrap: wrap;
      border-bottom: 1px solid var(--color-border-tertiary);
    }
    .platform-pill {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      font-size: 11px;
      font-weight: 500;
      color: var(--color-text-secondary);
      padding: 4px 10px;
      background: var(--color-background-secondary);
      border-radius: 20px;
    }
    .pill-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
    }

    /* Items section */
    .items-section {
      flex: 1;
    }
    .items-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 20px 8px;
    }
    .items-count {
      font-size: 13px;
      font-weight: 600;
      color: var(--color-text-primary);
    }
    .items-hint {
      font-size: 11px;
      color: var(--color-text-tertiary);
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .items-list {
      padding: 0;
    }

    /* Footer */
    .card-footer {
      padding: 10px 20px;
      font-size: 12px;
      color: var(--color-text-secondary);
      display: flex;
      align-items: center;
      gap: 6px;
      border-top: 1px solid var(--color-border-tertiary);
      background: #FFFBEB;
    }
    .card-footer .ti {
      color: #D97706;
      font-size: 15px;
    }

    @media (max-width: 640px) {
      .card-header {
        padding: 16px 16px 14px;
      }
      .card-meta {
        padding: 12px 16px;
      }
      .platform-row {
        padding: 8px 16px;
      }
      .items-head {
        padding: 10px 16px 6px;
      }
      .items-list {
        padding: 0;
      }
      .total-price {
        font-size: 19px;
      }
    }
  `]
})
export class BasketCardComponent {
  @Input() basket!: Basket;

  get cfg() {
    return STRATEGY_CFG[this.basket.strategy] ?? STRATEGY_CFG.BALANCED;
  }

  get savings(): number {
    return this.basket.items.reduce((sum, item) => {
      if (!item.available || !item.mrp || !item.price) return sum;
      return sum + Math.max(0, item.mrp - item.price);
    }, 0);
  }

  platformColor(p: string): string {
    return PLATFORM_COLORS[p?.toLowerCase()] ?? '#888';
  }
}
