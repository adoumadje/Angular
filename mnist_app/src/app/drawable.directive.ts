import { 
  Directive,
  HostListener,
  ElementRef,
  Output,
  EventEmitter,
  OnInit
} from '@angular/core';

@Directive({
  selector: '[appDrawable]'
})
export class DrawableDirective implements OnInit {

  canvas!: HTMLCanvasElement;
  ctx: any;

  painting:boolean = false;
  pos = { x: 0, y: 0 };

  @Output() newImage = new EventEmitter();

  constructor(private el: ElementRef) { }

  ngOnInit(): void {  
    this.canvas = this.el.nativeElement as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d');
  }

  setPosition(e:MouseEvent) {
    this.pos.x = e.offsetX;
    this.pos.y = e.offsetY;
  }

  startPosition(e:MouseEvent) {
    this.painting = true;
    this.draw();
  }

  finishedPosition() {
    this.painting = false;
    this.ctx.beginPath();
    this.newImage.emit(this.getImgData());
  }

  draw() {
    if(!this.painting) return;
    this.ctx.lineWidth = 10;
    this.ctx.lineCap = 'round';

    this.ctx.lineTo(this.pos.x, this.pos.y);
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.moveTo(this.pos.x, this.pos.y);
  }

  clear() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  getImgData(): ImageData {
    const scaled = this.ctx.drawImage(this.canvas, 0, 0, 28, 28);
    return this.ctx.getImageData(0, 0, 28, 28);
  }


  @HostListener('mousedown', ['$event']) onDown(e:MouseEvent) {
    this.setPosition(e);
    this.startPosition(e);
  }

  @HostListener('mousemove', ['$event']) onMove(e:MouseEvent) {
    this.setPosition(e);
    this.draw();
  }

  @HostListener('mouseup', ['$event']) onUp() {
    this.finishedPosition();
  }

  @HostListener('resize', ['$event']) onResize() {
    console.log('window resized');
  }

}
