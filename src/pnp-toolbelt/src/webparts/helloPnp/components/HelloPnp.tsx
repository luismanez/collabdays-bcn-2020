import * as React from 'react';
import styles from './HelloPnp.module.scss';
import { IHelloPnpProps, IHelloPnpState, IMovie } from './IHelloPnpProps';

import { getGUID } from '@pnp/common';

import { sp } from '@pnp/sp';
import "@pnp/sp/webs";
import "@pnp/sp/lists/web";
import "@pnp/sp/items/list";

import {
  ConsoleListener,
  FunctionListener,
  ILogEntry,
  Logger,
  LogLevel
} from "@pnp/logging";
import ApplicationInsightsLoggerListener from '../../../logging/ApplicationInsightsLoggerListener';

import { Settings, SPListConfigurationProvider } from "@pnp/config-store";

//const settings = new Settings();

// you can add/update a single value using add
//settings.add("defaultTop", "10");

let listener = new FunctionListener((entry: ILogEntry) => {
  console.log(`CUSTOM_LOGGER: ${entry.message}`);
});
// subscribe a listener
Logger.subscribe(new ConsoleListener(), listener);
Logger.subscribe(new ApplicationInsightsLoggerListener());
// set the active log level
Logger.activeLogLevel = LogLevel.Verbose;

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

    // get an instance of the provider wrapped
    // you can optionally provide a key that will be used in the cache to the asCaching method
    const wrappedProvider = provider.asCaching();

    const settings = new Settings();

    settings.load(wrappedProvider).then( () => {
      const defaultTop: string = settings.get("defaultTop");
      const top: number = parseInt(defaultTop);

      sp.web.lists.getByTitle("Movies")
        .items
        //.usingCaching()
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
      return <div>loading data...</div>;
    }

    return (
      <div className={ styles.helloPnp }>
        <ul>
        {this.state.movies.map((movie: IMovie) => {
          return <li>{movie.Title} - {movie.Year}</li>;
        })}
        </ul>
      </div>
    );
  }
}
