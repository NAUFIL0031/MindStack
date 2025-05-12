
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
    Component,
    ElementRef,
    Inject,
    OnDestroy,
    OnInit,
    PLATFORM_ID,
    Renderer2
} from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  isScrolled = false;
  observer: IntersectionObserver | undefined;
  scrollListener: Function | undefined;

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.initScrollEffect();
    this.initAnimationObserver();
  }

  ngOnDestroy(): void {
    if (this.scrollListener) {
      this.scrollListener();
    }
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  initScrollEffect(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.scrollListener = this.renderer.listen(window, 'scroll', () => {
        this.isScrolled = window.scrollY > 50;
      });
    }
  }

  initAnimationObserver(): void {
    if (isPlatformBrowser(this.platformId)) {
      const animatedElements = this.el.nativeElement.querySelectorAll('.animated');
      if (animatedElements.length > 0) {
        // Convert to array with proper typing
        const elementsArray = Array.from(animatedElements) as HTMLElement[];
        
        elementsArray.forEach((element) => {
          this.renderer.setStyle(element, 'opacity', '0');
          this.renderer.setStyle(element, 'transform', 'translateY(20px)');
        });

        this.observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              this.renderer.setStyle(entry.target, 'opacity', '1');
              this.renderer.setStyle(entry.target, 'transform', 'translateY(0)');
            }
          });
        }, { threshold: 0.1 });

        elementsArray.forEach((element) => {
          this.observer?.observe(element);
        });
      }
    }
  }

  toggleMenu(): void {
    const body = document.querySelector('body');
    body?.classList.toggle('menu-open');
  }

  closeMenu(): void {
    const body = document.querySelector('body');
    body?.classList.remove('menu-open');
  }

  addRippleEffect(event: MouseEvent): void {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const ripple = this.renderer.createElement('span');
    this.renderer.setStyle(ripple, 'position', 'absolute');
    this.renderer.setStyle(ripple, 'width', '0px');
    this.renderer.setStyle(ripple, 'height', '0px');
    this.renderer.setStyle(ripple, 'left', `${x}px`);
    this.renderer.setStyle(ripple, 'top', `${y}px`);
    this.renderer.setStyle(ripple, 'backgroundColor', 'rgba(255, 255, 255, 0.4)');
    this.renderer.setStyle(ripple, 'borderRadius', '50%');
    this.renderer.setStyle(ripple, 'transform', 'translate(-50%, -50%)');
    this.renderer.setStyle(ripple, 'animation', 'ripple 0.6s linear');

    this.renderer.setStyle(target, 'position', 'relative');
    this.renderer.setStyle(target, 'overflow', 'hidden');
    this.renderer.appendChild(target, ripple);

    setTimeout(() => {
      if (ripple && ripple.parentNode) {
        this.renderer.removeChild(target, ripple);
      }
    }, 600);
  }
}