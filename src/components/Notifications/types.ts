export interface FormExtraFields {
  [key: string]: string;
}

export interface FormRegexSelector {
  regexSelect: string;
  regexInput: string;
}

export interface FormState {
  event: {
    eventSelect: string;
    extraFields: FormExtraFields;
    regexSelector: FormRegexSelector[];
  };
  notification: {
    notificationSelect: string;
    jiraCommentInput: string;
    slackInput: string;
    emailInput: string;
  };
}
