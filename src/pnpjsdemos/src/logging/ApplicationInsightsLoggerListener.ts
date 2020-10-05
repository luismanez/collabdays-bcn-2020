import { ApplicationInsights } from '@microsoft/applicationinsights-web';

import {
  ILogListener,
  ILogEntry
} from "@pnp/logging";

export default class ApplicationInsightsLoggerListener implements ILogListener {

  private _appInsights: ApplicationInsights;

  constructor() {
    this._appInsights = new ApplicationInsights({ config: {
      instrumentationKey: 'f4392b1f-46a1-4eaa-bda9-ba7e8b345656'
    } });
    this._appInsights.loadAppInsights();
  }

  public log(entry: ILogEntry): void {
    this._appInsights.trackTrace({message: entry.message});
  }
}
