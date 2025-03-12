export interface ChapterInterface {
  id: string;
  chapterName: string;
}

export interface ChapterListInterface {
  chapters: ChapterInterface[];
  total: number;
}

export interface ResponseMsgInterface {
  message: string;
}