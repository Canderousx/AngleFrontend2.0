import {Directive, ElementRef, HostListener} from '@angular/core';

@Directive({
  selector: '[appMouseEnter]',
  standalone: true
})
export class MouseEnterDirective {

  originalColor!: string;
  hoverColor = 'rgba(64, 188, 255, 1)';

  constructor(private el: ElementRef) {
    this.originalColor = el.nativeElement.style.color;
  }

  changeColor(color: string){
    this.el.nativeElement.style.transition = "all 0.5s ease-in-out"
    this.el.nativeElement.style.color = color;
  }

  @HostListener('mouseenter') onMouseEnter(){
    this.changeColor(this.hoverColor);
  }
  @HostListener('mouseleave') onMouseLeave(){
    this.changeColor(this.originalColor);
  }




}
