export function bolderize(msg: string): string {
  const findSingleQuotes = /\'([^']+)\'/gim;
  const findDoubleQuotes = /\"([^"]+)\"/gim;

  function bold(_: string, value: string) {
    return `**${value}**`;
  }

  return msg.replace(findSingleQuotes, bold).replace(findDoubleQuotes, bold);
}
