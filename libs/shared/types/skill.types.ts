/**
 * Skill Category — Phân loại theo BẢN CHẤT kỹ năng, không phân biệt ngành nghề.
 *
 * Phổ quát cho mọi lĩnh vực: IT, Kế toán, Marketing, Giáo dục, Y tế, Kiến trúc...
 *
 * - TECHNICAL:    Kỹ năng chuyên môn cốt lõi (React, Kế toán thuế GTGT, SEO, AutoCAD...)
 * - TOOL:         Công cụ & Phần mềm (Docker, SAP, Google Analytics, Figma, Excel...)
 * - METHODOLOGY:  Phương pháp & Quy trình (Agile/Scrum, Six Sigma, Montessori, IFRS...)
 * - DOMAIN:       Kiến thức chuyên ngành & lý thuyết (Machine Learning, Luật thuế, Dược lý...)
 * - LANGUAGE:     Ngôn ngữ giao tiếp (English, Japanese, Korean, French...)
 * - CERTIFICATION:Chứng chỉ & Bằng cấp (AWS SAA, CPA, PMP, IELTS, TESOL...)
 * - SOFT_SKILL:   Kỹ năng mềm & năng lực cá nhân (Leadership, Communication, Critical Thinking...)
 * - OTHER:        Không thuộc các nhóm trên
 */
export enum SkillCategory {
  TECHNICAL     = 'technical',
  TOOL          = 'tool',
  METHODOLOGY   = 'methodology',
  DOMAIN        = 'domain',
  LANGUAGE      = 'language',
  CERTIFICATION = 'certification',
  SOFT_SKILL    = 'soft_skill',
  OTHER         = 'other',
}

export interface ISkill {
  id: string;
  profileId: string;
  name: string;
  category: SkillCategory;
  endorsementCount: number;
  displayOrder: number;
  createdAt: string | Date;
  updatedAt: string | Date;
}
