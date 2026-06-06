import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasketItem, PLATFORM_COLORS } from '../../core/models/comparison.models';
import { InrPipe } from '../../shared/pipes/inr.pipe';
import { PlatformNamePipe } from '../../shared/pipes/platform-name.pipe';

@Component({
  selector: 'app-basket-item',
  standalone: true,
  imports: [CommonModule, InrPipe, PlatformNamePipe],
  template: `
<div class="b-item" [class.b-item--unavail]="!item.available">
  <!-- Product image -->
  <div class="b-item-img">
    <div class="img-wrap" *ngIf="item.imageUrl && item.available && !imgError">
      <img [src]="item.imageUrl" [alt]="item.productName"
           (error)="imgError = true" loading="lazy" />
    </div>
    <div class="img-placeholder" *ngIf="!item.imageUrl || imgError || !item.available">
      <i class="ti ti-package" aria-hidden="true"></i>
    </div>
  </div>

  <!-- Item info -->
  <div class="b-item-info">
    <div class="b-item-name" [title]="item.productName || item.itemName">
      {{ item.productName || item.itemName }}
    </div>
    <div class="b-item-meta" *ngIf="item.available">
      <span class="dot" [style.background]="platformColor"></span>
      <span class="meta-plat">{{ item.platform | platformName }}</span>
      <span class="meta-sep">·</span>
      <span class="meta-delivery">
        <i class="ti ti-clock" aria-hidden="true"></i>
        {{ item.deliveryTime || '~15 min' }}
      </span>
      <span class="meta-sep" *ngIf="item.unit">·</span>
      <span class="meta-unit" *ngIf="item.unit">{{ item.unit }}</span>
    </div>
    <div class="b-item-meta" *ngIf="!item.available">
      <span class="unavail-badge">Currently unavailable</span>
    </div>
  </div>

  <!-- Price & CTA -->
  <div class="b-item-actions" *ngIf="item.available">
    <div class="b-item-pricing">
      <span class="b-item-price">{{ item.price | inr }}</span>
      <span class="b-item-mrp" *ngIf="item.mrp && item.mrp > item.price">
        {{ item.mrp | inr }}
      </span>
    </div>
    <a class="buy-cta" [href]="item.productUrl" target="_blank" rel="noopener"
       *ngIf="item.productUrl" aria-label="View on {{ item.platform }}">
      <span>View</span>
      <i class="ti ti-external-link" aria-hidden="true"></i>
    </a>
  </div>
</div>
  `,
  styles: [`
    .b-item {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 10px 20px;
      border-bottom: 1px solid var(--color-border-tertiary);
      transition: background var(--transition-fast);
    }
    .b-item:last-child {
      border-bottom: none;
    }
    .b-item:hover {
      background: var(--color-background-secondary);
    }
    .b-item--unavail {
      opacity: 0.45;
    }

    /* Image */
    .b-item-img {
      flex-shrink: 0;
      width: 48px;
      height: 48px;
    }
    .img-wrap {
      width: 100%;
      height: 100%;
      border-radius: var(--border-radius-sm);
      overflow: hidden;
      background: var(--color-background-secondary);
    }
    .img-wrap img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .img-placeholder {
      width: 100%;
      height: 100%;
      border-radius: var(--border-radius-sm);
      background: var(--color-background-secondary);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-text-tertiary);
    }
    .img-placeholder .ti {
      font-size: 20px;
    }

    /* Info */
    .b-item-info {
      flex: 1;
      min-width: 0;
    }
    .b-item-name {
      font-size: 13px;
      font-weight: 600;
      color: var(--color-text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-bottom: 2px;
    }
    .b-item-meta {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 11px;
      color: var(--color-text-secondary);
      flex-wrap: wrap;
    }
    .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      flex-shrink: 0;
    }
    .meta-plat {
      font-weight: 500;
    }
    .meta-sep {
      color: var(--color-text-tertiary);
    }
    .meta-delivery {
      display: flex;
      align-items: center;
      gap: 2px;
    }
    .meta-delivery .ti {
      font-size: 12px;
    }
    .meta-unit {
      color: var(--color-text-tertiary);
    }
    .unavail-badge {
      font-size: 11px;
      padding: 2px 8px;
      background: var(--color-background-tertiary);
      border-radius: 10px;
      color: var(--color-text-tertiary);
    }

    /* Actions */
    .b-item-actions {
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 6px;
    }
    .b-item-pricing {
      display: flex;
      align-items: baseline;
      gap: 5px;
    }
    .b-item-price {
      font-size: 15px;
      font-weight: 700;
      color: var(--color-text-primary);
    }
    .b-item-mrp {
      font-size: 11px;
      color: var(--color-text-tertiary);
      text-decoration: line-through;
    }
    .buy-cta {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 11px;
      font-weight: 600;
      padding: 5px 12px;
      background: var(--color-primary-light);
      color: var(--color-primary-dark);
      border-radius: 20px;
      text-decoration: none;
      transition: all var(--transition-fast);
    }
    .buy-cta:hover {
      background: var(--color-primary);
      color: #fff;
    }
    .buy-cta .ti {
      font-size: 11px;
    }

    @media (max-width: 640px) {
      .b-item {
        padding: 10px 16px;
        gap: 10px;
      }
      .b-item-img {
        width: 40px;
        height: 40px;
      }
      .b-item-name {
        font-size: 12px;
      }
      .b-item-price {
        font-size: 13px;
      }
    }
  `]
})
export class BasketItemComponent {
  @Input() item!: BasketItem;
  imgError = false;

  get platformColor(): string {
    return PLATFORM_COLORS[this.item.platform?.toLowerCase()] ?? '#888';
  }
}
