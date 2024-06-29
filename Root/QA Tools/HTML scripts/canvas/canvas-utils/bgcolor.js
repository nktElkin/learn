const bgcolor = (html) => {
  return html.replace(
    '<div style=""',
    '<div style="background-color: #FFFFFF"'
  );
};

export default bgcolor;
