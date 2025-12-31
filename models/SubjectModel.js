export const SubjectSchema = {
    subject: String,
    chapters: [
      {
        name: String,
        lectures: [String],
      },
    ],
  };
  