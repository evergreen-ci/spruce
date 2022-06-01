export const customFormats = {
  // Permit empty string but disallow whitespace
  noSpaces: /^$|^\S+$/,
  // Permit url
  url: /[(http(s)?)://(www.)?a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/gi,
};
