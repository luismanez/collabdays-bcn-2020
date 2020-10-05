export interface IHelloPnpGraphProps {
  description: string;
}

export interface IHelloPnpGraphState {
  groups: IGroup[];
}

export interface IGroup {
  id: string;
  displayName: string;
}
