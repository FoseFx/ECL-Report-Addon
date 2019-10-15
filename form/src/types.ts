
export interface Report {
  type: 'major'|'minor';
  service: 'classical';
  recaptcha: string;
  complainantUUID: string;
  complainantName: string;
  email: string;
  emailPub: boolean;
  emailReport: boolean;
  data: {
    why: string,
    division: string,
    matchroomLink: string,
    subject: string,
    additionalLinksData: AdditionalLinksData,
  };
  reportedUUID: string;
  reportedName: string;
}

export type AdditionalLinksData = Array<{link: string}>;
