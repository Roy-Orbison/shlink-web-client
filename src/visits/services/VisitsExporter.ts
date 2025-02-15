import { CsvJson } from 'csvjson';
import { NormalizedVisit } from '../types';
import { saveCsv } from '../../utils/helpers/files';

export class VisitsExporter {
  public constructor(
    private readonly window: Window,
    private readonly csvjson: CsvJson,
  ) {}

  public readonly exportVisits = (filename: string, visits: NormalizedVisit[]) => {
    if (!visits.length) {
      return;
    }

    const csv = this.csvjson.toCSV(visits, { headers: 'key' });

    saveCsv(this.window, csv, filename);
  };
}
