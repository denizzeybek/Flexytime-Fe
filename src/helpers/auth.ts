import { EStorageKeys } from '@/constants/storageKeys';

export const bearerHeader = () => {
  const token = localStorage.getItem(EStorageKeys.TOKEN)!;
  return { Authorization: 'Bearer ' + token };
};

export const authLoginHeader = () => {
  return {
    Authorization:
      'BASIC QzFBMDNCMTAtN0Q1OS00MDdBLUE5M0UtQjcxQUIxN0FEOEMyOjE3N0UzMjk1LTA2NTYtNDMxNy1CQzkxLUREMjcxQTE5QUNGRg==',
  };
};
