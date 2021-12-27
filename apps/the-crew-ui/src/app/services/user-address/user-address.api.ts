import { CreateQueryParams } from '@nestjsx/crud-request';
import { UserAddress, uuid } from '@the-crew/common';
import { axiosInstance, BaseHttpAPI } from '../../core/services';

const instance = axiosInstance;
const basePath = 'user-addresses';

class UserAddressHttpAPI extends BaseHttpAPI<UserAddress> {
  constructor() {
    super({
      basePath,
      instance,
    });
  }

  /**
   * Set the address of addressId as default and mark all
   * other address of the associated user as non-default.
   */
  updateDefaultAddress<R = UserAddress>(addressId: uuid, params: CreateQueryParams = {}) {
    const url = `${basePath}/update-default/${addressId}`;
    return instance.patch<R>(
      url,
      {},
      {
        params,
      },
    );
  }
}

export const userAddressApi = new UserAddressHttpAPI();
