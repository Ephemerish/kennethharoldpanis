import { StoreState } from './types';

const defaultState: StoreState = {
  automationSchedules: {
    aws: {
      schedule: '',
    },
    azure: {
      schedule: '',
    },
    gcp: {
      schedule: '',
    },
  },
};

export { defaultState };
