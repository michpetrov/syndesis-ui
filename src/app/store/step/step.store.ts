import { Injectable } from '@angular/core';
import { Connection, Action, Step, Steps, TypeFactory } from '../../model';

export interface StepKind extends Step {
  name: string;
  description: string;
  properties: any;
  visible?: (
    position: number,
    previous: Array<Step>,
    subsequent: Array<Step>,
  ) => boolean;
}
export type StepKinds = Array<StepKind>;

export const DATA_MAPPER = 'mapper';
export const BASIC_FILTER = 'rule-filter';
export const ADVANCED_FILTER = 'filter';
export const STORE_DATA = 'storeData';
export const SET_DATA = 'setData';
export const CALL_ROUTE = 'callRoute';
export const CONDITIONAL_PROCESSING = 'conditionalProcessing';
export const SPLIT = 'split';
export const LOG = 'log';

@Injectable()
export class StepStore {
  steps: StepKind[] = [
    {
      id: undefined,
      connection: undefined,
      action: undefined,
      name: 'Data Mapper',
      description: 'Map fields from the input type to the output type',
      stepKind: DATA_MAPPER,
      visible: (
        position: number,
        previous: Array<Step>,
        subsequent: Array<Step>,
      ): boolean => {
        // previous and subsequent steps need to have input and output data shapes respectively
        const prev = previous.filter(s => {
          return (
            s.action &&
            s.action.outputDataShape
          );
        });
        if (!prev.length) {
          return false;
        }
        const subs = subsequent.filter(s => {
          return (
            s.action && s.action.inputDataShape
          );
        });
        if (!subs.length) {
          return false;
        }
        return true;
      },
      properties: {},
      configuredProperties: undefined,
    },
    {
      id: undefined,
      connection: undefined,
      action: undefined,
      name: 'Basic Filter',
      description:
        'Continue the integration only if criteria you specify in simple input fields are met. Suitable for' +
        ' most integrations.',
      stepKind: BASIC_FILTER,
      properties: undefined,
      configuredProperties: undefined,
    },
    {
      id: undefined,
      connection: undefined,
      action: undefined,
      name: 'Advanced Filter',
      description:
        'Continue the integration only if criteria you define in scripting language expressions are met.',
      stepKind: ADVANCED_FILTER,
      properties: {
        filter: {
          type: 'textarea',
          displayName: 'Only continue if',
          required: true,
          rows: 10,
        },
      },
      configuredProperties: undefined,
    },
    /*
    {
      id: undefined,
      connection: undefined,
      action: undefined,
      name: 'Log',
      stepKind: LOG,
      description: "Sends a message to the integration's log",
      configuredProperties: undefined,
      properties: {
        message: {
          type: 'string',
          displayName: 'Log Message',
          required: true,
        },
        loggingLevel: {
          type: 'hidden',
          displayName: 'Level',
          defaultValue: 'INFO',
          required: true,
        },
      },
    },
    {
      id: undefined,
      connection: undefined,
      action: undefined,
      name: 'Store Data',
      stepKind: STORE_DATA,
      description:
        'Store data from an invocation to be used later in the integration',
      properties: {},
      configuredProperties: undefined,
    },
    {
      id: undefined,
      connection: undefined,
      action: undefined,
      name: 'Set Data',
      stepKind: SET_DATA,
      description: 'Enrich data used within an integration',
      properties: {},
      configuredProperties: undefined,
    },
    {
      id: undefined,
      connection: undefined,
      action: undefined,
      name: 'Call Route',
      stepKind: CALL_ROUTE,
      description:
        'Call a child integration route from the main integration flow',
      properties: {},
      configuredProperties: undefined,
    },
    {
      id: undefined,
      connection: undefined,
      action: undefined,
      name: 'Conditional Processing',
      stepKind: CONDITIONAL_PROCESSING,
      description: 'Add conditions and multiple paths for processing data',
      properties: {},
      configuredProperties: undefined,
    },
    {
      id: undefined,
      connection: undefined,
      action: undefined,
      name: 'Split',
      stepKind: SPLIT,
      description:
        'Split received data into data subsets that can be processed individually',
      properties: {},
      configuredProperties: undefined,
    },
    */
  ];

  getStepName(kind: string): string {
    const step = this.getStepConfig(kind);
    if (step) {
      return step.name;
    }
    return kind;
  }

  getStepDescription(kind: string): string {
    const step = this.getStepConfig(kind);
    if (step) {
      return step.description;
    }
    return '';
  }

  getStepConfig(kind: string) {
    return this.steps.find(step => step.stepKind === kind);
  }

  getSteps() {
    return this.steps;
  }

  // Check if we need a custom form handling which stores the parsed
  // properties in customProperties
  isCustomStep(step: Step): boolean {
    return step.stepKind === BASIC_FILTER || step.stepKind === DATA_MAPPER;
  }
}
