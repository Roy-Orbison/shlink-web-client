import { CsvJson } from 'csvjson';
import { ServerData } from '../data';

const validateServer = (server: any): server is ServerData =>
  typeof server.url === 'string' && typeof server.apiKey === 'string' && typeof server.name === 'string';

const validateServers = (servers: any): servers is ServerData[] =>
  Array.isArray(servers) && servers.every(validateServer);

export class ServersImporter {
  public constructor(private readonly csvJson: CsvJson, private readonly fileReaderFactory: () => FileReader) {}

  public readonly importServersFromFile = async (file?: File | null): Promise<ServerData[]> => {
    if (!file) {
      throw new Error('No file provided');
    }

    const reader = this.fileReaderFactory();

    return new Promise((resolve, reject) => {
      reader.addEventListener('loadend', (e: ProgressEvent<FileReader>) => {
        try {
          // TODO Read as stream, otherwise, if the file is too big, this will block the browser tab
          const content = e.target?.result?.toString() ?? '';
          const servers = this.csvJson.toObject(content);

          if (!validateServers(servers)) {
            throw new Error('Provided file does not have the right format.');
          }

          resolve(servers);
        } catch (e) {
          reject(e);
        }
      });
      reader.readAsText(file);
    });
  };
}
