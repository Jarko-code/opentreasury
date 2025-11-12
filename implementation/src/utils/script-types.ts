import { OpenTreasuryEntity } from '@opentreasury/opentreasury-service-api';

export interface ScriptDefinition extends OpenTreasuryEntity {
    displayName?: string;
    icon?: string;
    description?: string;
    type?: ScriptType;
    triggerObjectType?: string;
    triggerActionTypes?: string[];
    operationDefinitions?: string[];
    script?: string;
}

export interface ScheduledJob extends OpenTreasuryEntity {
    displayName?: string;
    definitionId?: string;
    active?: boolean;
    type?: string;
    intervalMinutes?: number;
    time?: string;
    days?: number[];
    lastRunTime?: string;
}

export enum ScriptType {
    FILE_IMPORT = 'FILE_IMPORT',
    JOB = 'JOB',
    EVENT_TRIGGER = 'EVENT_TRIGGER',
}

export const ScriptTypeTranslation: { [key in ScriptType]: string } = {
    FILE_IMPORT: 'File import',
    JOB: 'Job',
    EVENT_TRIGGER: 'Event trigger',
};

export enum ScriptTriggerObject {
    operation = 'operation',
}

export const ScriptTriggerObjectTypeTranslation: { [key in ScriptTriggerObject]: string } = {
    operation: 'Operation',
};

export enum ScriptTriggerActions {
    CREATED = 'CREATED',
    UPDATED = 'UPDATED',
    DELETED = 'DELETED',
    REQUESTED = 'REQUESTED',
}

export const ScriptTriggerActionsTypeTranslation: { [key in ScriptTriggerActions]: string } = {
    CREATED: 'On create',
    UPDATED: 'On update',
    DELETED: 'On delete',
    REQUESTED: 'On demand',
};

export enum ScheduledJobType {
    DAILY = 'DAILY',
    INTERVAL = 'INTERVAL',
}

export const ScheduledJobTypeTranslation: { [key in ScheduledJobType]: string } = {
    DAILY: 'Once a day',
    INTERVAL: 'Interval',
};
