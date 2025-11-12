import { OpenTreasuryEntity } from './open-treasury-entity.js';

export interface OpenTreasuryProcesses extends OpenTreasuryEntity {
    definitionId: string;
    finishTime: string;
    lastMessage: string;
    progress: number;
    startTime: Date;
    startedBy: Date;
}
