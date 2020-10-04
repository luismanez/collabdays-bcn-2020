import { FirstWeekOfYear } from "office-ui-fabric-react";

export interface IHelloPnpProps {
  description: string;
}

export interface IHelloPnpState {
  movies: IMovie[];
}

export interface IMovie {
  Title: string;
  Genre: string;
  Studio: string;
  Year: number;
}
