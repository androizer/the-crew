import { CreateQueryParams } from '@nestjsx/crud-request';
import { AxiosInstance } from 'axios';

import type { AnyObject } from '@the-crew/common';
import type { GetManyDefaultResponse } from '@nestjsx/crud';
import type { EntityId } from '@reduxjs/toolkit';

type HttpBaseConfig = {
  instance: AxiosInstance;
  basePath: string;
};

export class BaseHttpAPI<T> {
  private basePath: string;
  private instance: AxiosInstance;
  constructor(config: HttpBaseConfig) {
    this.basePath = config.basePath;
    this.instance = config.instance;
  }
  getMany<R = GetManyDefaultResponse<T>>(params: CreateQueryParams = {}) {
    const url = this.basePath;
    return this.instance.get<R>(url, {
      params,
    });
  }

  getOne<R = T>(id: EntityId, params: CreateQueryParams = {}) {
    const url = `${this.basePath}/${id}`;
    return this.instance.get<R>(url, {
      params,
    });
  }

  createOne<R = T>(payload: Partial<T> & AnyObject, params: CreateQueryParams = {}) {
    const url = this.basePath;
    return this.instance.post<R>(url, payload, {
      params,
    });
  }

  createMany<R = GetManyDefaultResponse<T>>(
    payload: Partial<T> & AnyObject,
    params: CreateQueryParams = {},
  ) {
    const url = `${this.basePath}/bulk`;
    return this.instance.post<R>(url, payload, {
      params,
    });
  }

  updateOne<R = Partial<T>>(
    id: EntityId,
    payload: Partial<Omit<T, 'id'>>,
    params: CreateQueryParams = {},
  ) {
    const url = `${this.basePath}/${id}`;
    return this.instance.patch<R>(url, payload, {
      params,
    });
  }

  replaceOne<R = T>(id: EntityId, payload: Omit<T, 'id'>, params: CreateQueryParams = {}) {
    const url = `${this.basePath}/${id}`;
    return this.instance.put<R>(url, payload, {
      params,
    });
  }

  deleteOne<R = T>(id: EntityId) {
    const url = `${this.basePath}/${id}`;
    return this.instance.delete<void | R>(url);
  }
}
