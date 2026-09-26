import { englishQuestions } from "./english";
import { integratedScienceQuestions } from "./integrated-science";
import { mathematicsQuestions } from "./mathematics";
import { socialStudiesQuestions } from "./social-studies";

export const questions = [
  ...mathematicsQuestions,
  ...englishQuestions,
  ...integratedScienceQuestions,
  ...socialStudiesQuestions,
];
