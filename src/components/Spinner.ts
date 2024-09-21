import GLOBALS from '@/content/globals.yaml';
import { type RecordProps } from '@/utils/tools.ts';

export const Spinner = (): string => `
  <svg width='6rem' height='25rem' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
    <circle class='spinner' cx='4' cy='12' r='3' />
    <circle class='spinner spinnerCenter' cx='12' cy='12' r='3' />
    <circle class='spinner spinnerRight' cx='20' cy='12' r='3' />

    <style>
      .spinner {
        animation: spin 1.05s infinite;
        fill: ${(GLOBALS as { COLORS: RecordProps }).COLORS.black};
      }

      .spinnerCenter {
        animation-delay: .1s;
      }

      .spinnerRight {
        animation-delay: .2s;
      }

      @keyframes spin {
        0%, 57.14% {
          animation-timing-function: cubic-bezier(0.33, .66, .66, 1);
          transform: translate(0);
        }

        28.57% {
          animation-timing-function: cubic-bezier(0.33, 0, .66, .33);
          transform: translateY(-6px);
        }

        100% {
          transform: translate(0);
        }
      }
    </style>
  </svg>
`;
