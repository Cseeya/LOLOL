export const RELEASE = Number(process.env.RELEASE);
// https://vitejs.dev/guide/api-javascript.html#resolveconfig
export const COMMAND = process.env.COMMAND as 'serve' | 'build';

export const paramKeys = {
  ROOM_ID: 'rid',
};

export const events = {
  SINGAL: 'singal',
};

export const queryKeys = {
  REDIRECT_URI: 'redirect_uri',
};

// clean outdate cache data
[].forEach((key) => localStorage.removeItem(key));
export const localStorageKeys = {
  CONFIGURE_LOCAL_STORAGE_KEY: 'configure_v1',
  STORE_LOCAL_STORAGE_KEY: 'store_v2',
};

export enum SingalType {
  OFFER = 'offer',
  ANSWER = 'answer',
  NEW_ICE_CANDIDATE = 'new-ice-candidate',
}
export type Singal = {
  type: SingalType;
  data: any;
};
export type SingalEvent = {
  userId: number;
  singal: Singal;
};
