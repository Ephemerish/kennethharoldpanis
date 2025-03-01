import { subMonths, format } from 'date-fns';
import { axiosInstance } from '@project-ed/lib/http-service';
import { parseGrpcData, getApiUrl } from '@project-ed/lib/utils';
import { errorToast, successToast } from '@project-ed/lib/ui';
import { StoreActions, Vendors } from './types';

const createActions = (set: any): StoreActions => ({
  getAutomationDates: async (vendor: Vendors) => {
    // Fetch data
    try {
      await new Promise((resolve, reject) => {
        parseGrpcData(
          {
            url: getApiUrl('blue', `cost/v1/${vendor}/calculations/schedules`),
            method: 'get',
            headers: {
              Authorization:
                axiosInstance.defaults.headers.common['Authorization'],
            },
            body: {},
          },
          {
            limiter: 0,
            concatData: false,
          },
          (data: any) => {
            // Handle chunk data
          },
          (data: any) => {
            // Handle final data
            set((state: any) => ({
              automationSchedules: {
                ...state.automationSchedules,
                [vendor]: data,
              },
            }));
            resolve(data);
            successToast('DATA FETCHED')();
          },
          (error: any) => {
            // errorToast('Failed to finalize cost')();

            const dataStr = error.response.data;

            const codeMatch = dataStr.match(/"code":(\d+)/);
            const code = codeMatch ? codeMatch[1] : null;

            // Extract message
            const messageMatch = dataStr.match(/"message":"(.*?)"/);
            const message = messageMatch ? messageMatch[1] : null;

            errorToast(`Finalization failed: ${code} - ${message}`)();

            reject(error);
          }
        );
      });
    } catch (error) {
      console.error('Failed to fetch automation dates', error);
    }
  },
  setAutomationDates: async (
    vendor: Vendors,
    automationSchedule: {
      schedule: string;
      scheduleMacro?: string;
      targetMonth?: string;
      notificationChannel?: string;
      force?: boolean;
      dryRun?: boolean;
    }
  ) => {
    // Fetch data
    try {
      await new Promise((resolve, reject) => {
        parseGrpcData(
          {
            url: getApiUrl('blue', `cost/v1/${vendor}/calculations/schedules`),
            method: 'post',
            headers: {
              Authorization:
                axiosInstance.defaults.headers.common['Authorization'],
            },
            body: automationSchedule,
          },
          {
            limiter: 0,
            concatData: false,
          },
          (data: any) => {
            // Handle chunk data
          },
          (data: any) => {
            // Handle final data
            resolve(data);
            successToast('DATA SET')();
          },
          (error: any) => {
            // errorToast('Failed to finalize cost')();

            const dataStr = error.response.data;

            const codeMatch = dataStr.match(/"code":(\d+)/);
            const code = codeMatch ? codeMatch[1] : null;

            // Extract message
            const messageMatch = dataStr.match(/"message":"(.*?)"/);
            const message = messageMatch ? messageMatch[1] : null;

            errorToast(`Finalization failed: ${code} - ${message}`)();

            reject(error);
          }
        );
      });
    } catch (error) {
      console.error('Failed to fetch automation dates', error);
    }
  },
  deleteAutomationDates: async (vendor: Vendors, id: string) => {
    // Fetch data
    try {
      await new Promise((resolve, reject) => {
        parseGrpcData(
          {
            url: getApiUrl(
              'blue',
              `cost/v1/${vendor}/calculations/schedules/${id}`
            ),
            method: 'delete',
            headers: {
              Authorization:
                axiosInstance.defaults.headers.common['Authorization'],
            },
            body: {},
          },
          {
            limiter: 0,
            concatData: false,
          },
          (data: any) => {
            // Handle chunk data
          },
          (data: any) => {
            // Handle final data
            resolve(data);
            successToast('DATA DELETED')();
          },
          (error: any) => {
            // errorToast('Failed to finalize cost')();

            const dataStr = error.response.data;

            const codeMatch = dataStr.match(/"code":(\d+)/);
            const code = codeMatch ? codeMatch[1] : null;

            // Extract message
            const messageMatch = dataStr.match(/"message":"(.*?)"/);
            const message = messageMatch ? messageMatch[1] : null;

            errorToast(`Finalization failed: ${code} - ${message}`)();

            reject(error);
          }
        );
      });
    } catch (error) {
      console.error('Failed to fetch automation dates', error);
    }
  },
});

export default createActions;
