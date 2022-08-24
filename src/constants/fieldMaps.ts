import { getDateCopy } from "utils/string";

export const timeZones = [
  {
    str: "Coordinated Universal Time",
    value: "UTC",
  },
  {
    str: "American Samoa, Niue",
    value: "Pacific/Niue",
  },
  {
    str: "Hawaii",
    value: "Pacific/Tahiti",
  },
  {
    str: "Marquesas Islands",
    value: "Pacific/Marquesas",
  },
  {
    str: "Alaska",
    value: "America/Anchorage",
  },
  {
    str: "Pacific Time",
    value: "America/Vancouver",
  },
  {
    str: "Mountain Time",
    value: "America/Denver",
  },
  {
    str: "Central Time",
    value: "America/Chicago",
  },
  {
    str: "Eastern Time",
    value: "America/New_York",
  },
  {
    str: "Venezuela",
    value: "America/Caracas",
  },
  {
    str: "Atlantic Time",
    value: "America/Barbados",
  },
  {
    str: "Newfoundland",
    value: "America/St_Johns",
  },
  {
    str: "Argentina, Paraguay",
    value: "America/Belem",
  },
  {
    str: "Fernando de Noronha",
    value: "America/Noronha",
  },
  {
    str: "Cape Verde",
    value: "Atlantic/Cape_Verde",
  },
  {
    str: "Iceland",
    value: "Atlantic/Reykjavik",
  },
  {
    str: "United Kingdom, Ireland",
    value: "Europe/London",
  },
  {
    str: "Central European Time, Nigeria",
    value: "Europe/Rome",
  },
  {
    str: "Egypt, Israel, Romania",
    value: "Europe/Bucharest",
  },
  {
    str: "Ethiopia, Iraq, Yemen",
    value: "Asia/Baghdad",
  },
  {
    str: "Iran",
    value: "Asia/Tehran",
  },
  {
    str: "Dubai, Moscow",
    value: "Europe/Moscow",
  },
  {
    str: "Afghanistan",
    value: "Asia/Kabul",
  },
  {
    str: "Maldives, Pakistan",
    value: "Antarctica/Davis",
  },
  {
    str: "India, Sri Lanka",
    value: "Asia/Kolkata",
  },
  {
    str: "Nepal",
    value: "Asia/Kathmandu",
  },
  {
    str: "Bangladesh, Bhutan",
    value: "Asia/Dhaka",
  },
  {
    str: "Cocos Islands, Myanmar",
    value: "Asia/Rangoon",
  },
  {
    str: "Thailand, Vietnam",
    value: "Asia/Bangkok",
  },
  {
    str: "China, Hong Kong, Perth",
    value: "Asia/Hong_Kong",
  },
  {
    str: "Eucla (Unofficial)",
    value: "Australia/Eucla",
  },
  {
    str: "Japan, South Korea",
    value: "Asia/Seoul",
  },
  {
    str: "Australia Central Time",
    value: "Australia/Adelaide",
  },
  {
    str: "Australia Eastern Time",
    value: "Australia/Sydney",
  },
  {
    str: "Lord Howe Island",
    value: "Australia/Lord_Howe",
  },
  {
    str: "Russia Vladivostok Time",
    value: "Asia/Vladivostok",
  },
  {
    str: "Norfolk Island",
    value: "Pacific/Norfolk",
  },
  {
    str: "Fiji, Russia Magadan Time",
    value: "Asia/Magadan",
  },
  {
    str: "Chatham Islands",
    value: "Pacific/Chatham",
  },
  {
    str: "Tonga",
    value: "Pacific/Tongatapu",
  },
  {
    str: "Kiribati Line Islands",
    value: "Pacific/Kiritimati",
  },
];

export const awsRegions = [
  {
    str: "US-East-1",
    value: "us-east-1",
  },
];

export const dateFormats = [
  {
    value: "MM-dd-yyyy",
    str: `MM-dd-yyyy - ${getDateCopy("08/31/2022", {
      dateFormat: "MM-dd-yyyy",
    })}`,
  },
  {
    value: "dd-MM-yyyy",
    str: `dd-MM-yyyy - ${getDateCopy("08/31/2022", {
      dateFormat: "dd-MM-yyyy",
    })}`,
  },
  {
    value: "yyyy-MM-dd",
    str: `yyyy-MM-dd - ${getDateCopy("08/31/2022", {
      dateFormat: "yyyy-MM-dd",
    })}`,
  },
  {
    value: "MM/dd/yyyy",
    str: `MM/dd/yyyy - ${getDateCopy("08/31/2022", {
      dateFormat: "MM/dd/yyyy",
    })}`,
  },
  {
    value: "dd/MM/yyyy",
    str: `dd/MM/yyyy - ${getDateCopy("08/31/2022", {
      dateFormat: "dd/MM/yyyy",
    })}`,
  },
  {
    value: "yyyy/MM/dd",
    str: `yyyy/MM/dd - ${getDateCopy("08/31/2022", {
      dateFormat: "yyyy/MM/dd",
    })}`,
  },
  {
    value: "MMM d, yyyy",
    str: `MMM d, yyyy - ${getDateCopy("08/31/2022", {
      dateFormat: "MMM d, yyyy",
    })}`,
  },
];

export const notificationFields = {
  patchFinish: "Patch finish",
  patchFirstFailure: "Patch first task failure",
  spawnHostOutcome: "Spawn host outcome",
  spawnHostExpiration: "Spawn host expiration",
  buildBreak: "Build break",
  commitQueue: "Commit queue",
};
