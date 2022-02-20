import { Injectable } from '@nestjs/common';
import { BehaviorSubject } from 'rxjs';

import { AbstractBaseEvent } from '../models';

@Injectable()
export class EventService {
  private readonly _eventStream = new BehaviorSubject<AbstractBaseEvent>(null);
  public readonly serverSentEvent = this._eventStream.asObservable();

  enqueueEvent(evt: AbstractBaseEvent) {
    this._eventStream.next(evt);
  }
}
