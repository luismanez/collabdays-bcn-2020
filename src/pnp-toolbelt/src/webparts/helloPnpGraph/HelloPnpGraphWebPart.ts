import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'HelloPnpGraphWebPartStrings';
import HelloPnpGraph from './components/HelloPnpGraph';
import { IHelloPnpGraphProps } from './components/IHelloPnpGraphProps';

import { graph } from "@pnp/graph";

export interface IHelloPnpGraphWebPartProps {
  description: string;
}

export default class HelloPnpGraphWebPart extends BaseClientSideWebPart<IHelloPnpGraphWebPartProps> {

  public onInit(): Promise<void> {
    return super.onInit().then(_ => {
      graph.setup({
        spfxContext: this.context
      });
    });
  }

  public render(): void {
    const element: React.ReactElement<IHelloPnpGraphProps> = React.createElement(
      HelloPnpGraph,
      {
        description: this.properties.description
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
