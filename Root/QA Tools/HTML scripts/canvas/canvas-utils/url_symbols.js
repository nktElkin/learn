const url_symbols = (html) => {
  return html
    .replace(/subject=(.*?)"/g, (_, subject_line) => `subject=${subject_line.replace(/ /g, "%20")}"`)
    .replace(/%7B%7B/g, "{{")
    .replace(/%7D%7D/g, "}}")
    .replace(/%5B/g, "[")
    .replace(/%5D/g, "]");
};

export default url_symbols;
