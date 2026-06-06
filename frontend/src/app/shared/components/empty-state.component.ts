import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  template: `
<div class="empty">
  <div class="empty-illustration">
    <div class="ill-circle ill-circle--1"></div>
    <div class="ill-circle ill-circle--2"></div>
    <div class="ill-circle ill-circle--3"></div>
    <div class="ill-icon">
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
        <rect x="8" y="20" width="48" height="36" rx="6" fill="#FC8019" fill-opacity="0.15" stroke="#FC8019" stroke-width="2"/>
        <path d="M20 28h24v4H20z" fill="#FC8019" fill-opacity="0.3"/>
        <path d="M24 34h16v2H24z" fill="#FC8019" fill-opacity="0.2"/>
        <path d="M22 38h20v2H22z" fill="#FC8019" fill-opacity="0.15"/>
        <circle cx="32" cy="44" r="6" fill="#FC8019" fill-opacity="0.2" stroke="#FC8019" stroke-width="1.5"/>
        <path d="M30 44h4M32 42v4" stroke="#FC8019" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M32 8v6M24 12l4 4M40 12l-4 4" stroke="#FC8019" stroke-width="2" stroke-linecap="round" stroke-opacity="0.5"/>
      </svg>
    </div>
  </div>

  <h2 class="empty-title">Compare prices instantly</h2>
  <p class="empty-desc">
    Type any grocery or essentials items above — separated by commas —
    and we'll scan <strong>Zepto</strong>, <strong>Blinkit</strong>,
    <strong>Swiggy Instamart</strong> & more for the best deal.
  </p>

  <div class="empty-features">
    <div class="feature-item">
      <div class="feature-dot" style="background:#8B5CF6"></div>
      <span>Zepto</span>
    </div>
    <div class="feature-item">
      <div class="feature-dot" style="background:#F59E0B"></div>
      <span>Blinkit</span>
    </div>
    <div class="feature-item">
      <div class="feature-dot" style="background:#F97316"></div>
      <span>Swiggy Instamart</span>
    </div>
    <div class="feature-item">
      <div class="feature-dot" style="background:#16A34A"></div>
      <span>BigBasket</span>
    </div>
    <div class="feature-item">
      <div class="feature-dot" style="background:#2563EB"></div>
      <span>JioMart</span>
    </div>
  </div>

  <div class="empty-examples">
    <div class="example-chip">
      <i class="ti ti-tag" aria-hidden="true"></i>
      milk, bread, eggs
    </div>
    <div class="example-chip">
      <i class="ti ti-tag" aria-hidden="true"></i>
      coconut oil, atta, ghee
    </div>
    <div class="example-chip">
      <i class="ti ti-tag" aria-hidden="true"></i>
      shampoo, soap, toothpaste
    </div>
    <div class="example-chip">
      <i class="ti ti-tag" aria-hidden="true"></i>
      phone charger, earphones
    </div>
  </div>
</div>
  `,
  styles: [`
    .empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 24px 80px;
      text-align: center;
      max-width: 600px;
      margin: 0 auto;
    }
    .empty-illustration {
      position: relative;
      width: 120px;
      height: 100px;
      margin-bottom: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .ill-circle {
      position: absolute;
      border-radius: 50%;
    }
    .ill-circle--1 {
      width: 100px;
      height: 100px;
      background: radial-gradient(circle, rgba(252, 128, 25, 0.1) 0%, transparent 70%);
      top: 0;
      left: 10px;
      animation: float 4s ease-in-out infinite;
    }
    .ill-circle--2 {
      width: 60px;
      height: 60px;
      background: radial-gradient(circle, rgba(252, 128, 25, 0.08) 0%, transparent 70%);
      top: 20px;
      right: 0;
      animation: float 5s ease-in-out infinite 0.5s;
    }
    .ill-circle--3 {
      width: 40px;
      height: 40px;
      background: radial-gradient(circle, rgba(252, 128, 25, 0.06) 0%, transparent 70%);
      bottom: 10px;
      left: 30px;
      animation: float 6s ease-in-out infinite 1s;
    }
    .ill-icon {
      position: relative;
      z-index: 1;
    }
    .empty-title {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 10px;
      color: var(--color-text-primary);
      letter-spacing: -0.3px;
    }
    .empty-desc {
      font-size: 15px;
      color: var(--color-text-secondary);
      line-height: 1.7;
      margin-bottom: 28px;
    }
    .empty-desc strong {
      color: var(--color-text-primary);
      font-weight: 600;
    }
    .empty-features {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
      justify-content: center;
      margin-bottom: 28px;
    }
    .feature-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      font-weight: 500;
      color: var(--color-text-secondary);
    }
    .feature-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }
    .empty-examples {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      justify-content: center;
    }
    .example-chip {
      font-size: 13px;
      padding: 8px 16px;
      background: var(--color-background-primary);
      border: 1px solid var(--color-border-secondary);
      border-radius: var(--border-radius-md);
      color: var(--color-text-secondary);
      cursor: default;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all var(--transition-fast);
      box-shadow: var(--shadow-sm);
    }
    .example-chip:hover {
      border-color: var(--color-border-primary);
      box-shadow: var(--shadow-md);
      transform: translateY(-1px);
    }
    .example-chip .ti {
      color: var(--color-primary);
      font-size: 14px;
    }
    @media (max-width: 640px) {
      .empty {
        padding: 40px 16px 60px;
      }
      .empty-title {
        font-size: 20px;
      }
      .empty-desc {
        font-size: 14px;
      }
    }
  `]
})
export class EmptyStateComponent {}
