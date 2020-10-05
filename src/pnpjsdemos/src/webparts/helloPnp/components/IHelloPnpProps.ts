export interface IHelloPnpProps {
  description: string;
}

export interface IHelloPnpState {
  movies: IMovie[];
}

export interface IMovie {
  Title: string;
  Genre: string;
  Year: string;
}
