import * as React from 'react';
import styles from './HelloPnpGraph.module.scss';
import { IHelloPnpGraphProps, IHelloPnpGraphState } from './IHelloPnpGraphProps';
import { escape } from '@microsoft/sp-lodash-subset';

// import { graph } from "@pnp/graph";
// import "@pnp/graph/groups";

import { graph, GraphQueryableCollection } from "@pnp/graph/presets/all";

export default class HelloPnpGraph extends React.Component<IHelloPnpGraphProps, IHelloPnpGraphState> {

  constructor(props: IHelloPnpGraphProps) {
    super(props);
    this.state = {
      groups: []
    };
  }

  public componentDidMount(): void {
    graph.groups
      .top(5)
      .select("id, displayName")
      .get()
      .then(groups => {
        this.setState({
          groups: groups.map(g => {
            return {
              displayName: g.displayName,
              id: g.id
            };
          })
        });
      });
  }

  public render(): React.ReactElement<IHelloPnpGraphProps> {
    if (this.state.groups.length == 0) {
      return <div>Loading groups...</div>;
    }

    return (
      <div className={ styles.helloPnpGraph }>
        <ul>
          {
            this.state.groups.map(g => <li>{g.id} - {g.displayName}</li>)
          }
        </ul>
      </div>
    );
  }
}
