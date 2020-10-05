import * as React from 'react';
import styles from './HelloPnp.module.scss';
import { IHelloPnpProps, IHelloPnpState, IMovie } from './IHelloPnpProps';
import { escape } from '@microsoft/sp-lodash-subset';

import { getGUID } from '@pnp/common';

import { sp } from "@pnp/sp/presets/core";

import { ConsoleListener, FunctionListener, ILogEntry, Logger, LogLevel } from "@pnp/logging";
import ApplicationInsightsLoggerListener from '../../../logging/ApplicationInsightsLoggerListener';
import { Settings, SPListConfigurationProvider } from '@pnp/config-store';

let listener = new FunctionListener((entry: ILogEntry) => {
  console.log(`CUSTOM_LOGGER: ${entry.message}`);
});
// subscribe a listener
Logger.subscribe(new ConsoleListener(), listener, new ApplicationInsightsLoggerListener());

Logger.activeLogLevel = LogLevel.Info;

export default class HelloPnp extends React.Component<IHelloPnpProps, IHelloPnpState> {

  constructor(props: IHelloPnpProps) {
    super(props);

    this.state = {
      movies: []
    };
  }

  public componentDidMount(): void {

    Logger.write("Entering componentDidMount...");

    const provider = new SPListConfigurationProvider(sp.web, "PnPJSConfiguration");

    const wrappedProvider = provider.asCaching();

    const settings = new Settings();
    settings.load(wrappedProvider).then(() => {
      const top = parseInt(settings.get("defaultTop"));
      sp.web.lists.getByTitle('Movies')
      .items
      .usingCaching()
      .select("Title", "Year")
      .top(top)
      .getPaged<IMovie[]>().then((data) => {
        Logger.writeJSON(data, LogLevel.Info);
        this.setState({
          movies: data.results
        });
      });
    });
  }

  public render(): React.ReactElement<IHelloPnpProps> {

    if (this.state.movies.length == 0) {
      return <div>loading movies...</div>;
    }

    return (
      <div className={ styles.helloPnp }>
        {
          this.state.movies.map(m => <li>{m.Title} - {m.Year}</li>)
        }
      </div>
    );
  }
}
