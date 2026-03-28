export type View = 'dashboard' | 'semantic-search' | 'ocr' | 'flyer-creator';

export interface RecentAsset {
  id: string;
  name: string;
  modified: string;
  type: 'pdf' | 'xlsx' | 'doc';
}

export interface Layer {
  id: string;
  name: string;
  visible: boolean;
  type: 'text' | 'image' | 'grid';
}
