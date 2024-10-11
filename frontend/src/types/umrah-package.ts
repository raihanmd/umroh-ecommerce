import { TGrade } from "./grade";
import { TUstadz } from "./ustadz";

export type TUmrahPackage = {
  id: string;
  ustadz_id: string;
  grade_id: string;
  name: string;
  description: string;
  price: number;
  photo_urls: string;
  video_urls: string;
  created_at: string;
  updated_at: string;
  grade: Pick<TGrade, "name">;
  ustadz: Pick<TUstadz, "name">;
};
