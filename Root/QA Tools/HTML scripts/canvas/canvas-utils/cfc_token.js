const cfc_token = (html) => {
  const tokens = [
    "{{userEmailAddress}}",
    "{{User.Phone}}",
    "{{User.MobilePhone}}",
  ];

  const token_part = html.substring(
    html.indexOf("{{userEmailAddress}}") - 300,
    html.indexOf("{{userEmailAddress}}")
  );

  const color = /color:(.*?);/.exec(token_part)
    ? /color:(.*?);/.exec(token_part)[1]
    : "#444444";

  for (const token of tokens)
    html = html.replace(
      token,
      `<a href="#" style="pointer-events: none; cursor: default; color: ${color}; text-decoration: none;">${token}</a>`
    );
  return html;
};

export default cfc_token;
