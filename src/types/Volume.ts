export interface Volume {
  id: number;
  number: number;
  title: string;
  owned: boolean;
  coverUrl: string;
  description?: string;
  releaseDate?: string;
}