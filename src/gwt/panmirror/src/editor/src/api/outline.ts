export interface EditorOutlineItem {
  navigation_id: string;
  type: EditorOutlineItemType;
  level: number;
  title: string;
  children: EditorOutlineItem[];
}

export type EditorOutlineItemType = 'heading' | 'rmd_chunk' | 'yaml_metadata';

export type EditorOutline = EditorOutlineItem[];
