import { OpenTreasuryEntityServiceApi } from '../open-treasury-entity-service-api.js';
import { OpenTreasuryFile } from '../../entities/open-treasury-file.js';

export interface FileServiceApi extends OpenTreasuryEntityServiceApi<OpenTreasuryFile> {
    saveFile(file: FormData): Promise<string>;

    downloadFile(fileId: string): Promise<BlobPart>;
}
