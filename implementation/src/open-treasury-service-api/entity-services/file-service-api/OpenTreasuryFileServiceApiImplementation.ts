import { OpenTreasuryFileServiceApi } from './OpenTreasuryFileServiceApi.js';
import { BaseOpenTreasuryServiceApi } from '../BaseOpenTreasuryServiceApi.js';
import { OpenTreasuryFile } from '@opentreasury/opentreasury-service-api';
import { ApiEntityService } from '../../../api-types.js';

class OpenTreasuryFileServiceApiImplementation
    extends BaseOpenTreasuryServiceApi<OpenTreasuryFile>
    implements OpenTreasuryFileServiceApi
{
    protected entityType = 'file' as const;
    downloadFile(fileId: string): Promise<BlobPart> {
        console.log('fileId', fileId);
        throw new Error('Method not implemented.');
    }

    protected getApiService(): ApiEntityService {
        return this._api.ResourceService.files;
    }

    async saveFile(formData: FormData): Promise<string> {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return (await this._api.ResourceService.files.save(formData))?.details?.id as string;
    }
}

export { OpenTreasuryFileServiceApiImplementation };
