const TERM_CODES = {
  '1': 'Spring',
  '4': 'Summer',
  '7': 'Fall',
};

export default (termCode) => {
  if (typeof termCode !== 'string') {
    throw new TypeError(
      `\`termCode\` must be a \`string\`, received \`${typeof termCode}\``
    );
  }

  if (parseInt(termCode.substr(0, 1)) > 1) {
    throw new RangeError(
      `\`termCode\` provided (${termCode}) is outside acceptable range`
    );
  }

  if (termCode.length !== 4) {
    throw new RangeError(`\`termCode\` ${termCode} is malformed`);
  }

  if (
    Object.keys(TERM_CODES).indexOf(termCode.substr(termCode.length - 1)) === -1
  ) {
    throw new RangeError(
      `Invalid term provided in \`termCode\` (received ${termCode.substr(
        termCode.length - 1
      )})`
    );
  }

  const termName = TERM_CODES[termCode.substr(termCode.length - 1)];
  const century = termCode.substr(0, 1) === '0' ? '19' : '20';
  const year = termCode.substr(1, 2);
  return `${termName} ${century}${year}`;
};
