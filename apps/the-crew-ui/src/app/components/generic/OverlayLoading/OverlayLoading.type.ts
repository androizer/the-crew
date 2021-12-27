import { AnyObject } from '@the-crew/common';

export type LoaderType =
  | 'Babel'
  | 'Block'
  | 'BlockReserve'
  | 'Box'
  | 'Circle'
  | 'CircleToBlock'
  | 'Common'
  | 'Disappeared'
  | 'LoopCircle'
  | 'NineCell'
  | 'TouchBall'
  | 'Transverse'
  | 'Wave'
  | 'WaveTopBottom'
  | 'WindMill'
  | 'JumpCircle'
  | 'MeteorRain'
  | 'RotateCircle'
  | 'StickyBall'
  | 'Semipolar'
  | 'SolarSystem'
  | 'Ladder'
  | 'HeartBoom'
  | 'RollBox'
  | 'RectGraduallyShow'
  | 'PointSpread'
  | 'ThreeHorse'
  | 'PassThrough'
  | 'Coffee'
  | 'Battery'
  | 'Diamon'
  | 'Eat';

export class LoaderOptions {
  type: LoaderType;
  color: string;
  speed: number;
  size: 'small' | 'default' | 'large';
  style: AnyObject;

  constructor(data: Partial<LoaderOptions> = {}) {
    this.type = data.type ?? 'Semipolar';
    this.color = data.color ?? 'yellow';
    this.speed = data.speed;
    this.size = data.size ?? 'large';
    this.style = data.style;
  }
}
