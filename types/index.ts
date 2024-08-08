export interface Lesson {
  id: string;
  name: string;
}

export interface Class {
  id: string;
  class: string;
  data: Lesson[];
}

export interface ClassLog {
  id: string;
  classId: string;
  lessonId: string;
  date: string | Date | null;
  time: string | Date | null;
  note?: string;
}
