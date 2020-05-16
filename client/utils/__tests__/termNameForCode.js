import termNameForCode from '../termNameForCode';

describe('termNameForCode', () => {
  it('should throw TypeError when receiving other than string', () => {
    expect(() => {
      termNameForCode(1167);
    }).toThrowError(TypeError);
  });

  it('should throw RangeError if term code outside range', () => {
    expect(() => {
      termNameForCode('2167');
    }).toThrowError(RangeError);
  });

  it('should throw RangeError if term code is too long', () => {
    expect(() => {
      termNameForCode('12345');
    }).toThrowError(RangeError);
  });

  it('should throw RangeError if term code is too short', () => {
    expect(() => {
      termNameForCode('123');
    }).toThrowError(RangeError);
  });

  it('should throw RangeError if invalid term provided in termCode', () => {
    expect(() => {
      termNameForCode('1169');
    }).toThrowError(RangeError);
  });

  it('1167 should return "Fall 2016"', () => {
    expect(termNameForCode('1167')).toBe('Fall 2016');
  });

  it('1171 should return "Spring 2017"', () => {
    expect(termNameForCode('1171')).toBe('Spring 2017');
  });

  it('1174 should return "Summer 2017"', () => {
    expect(termNameForCode('1174')).toBe('Summer 2017');
  });

  it('0977 should return "Fall 1997"', () => {
    expect(termNameForCode('0977')).toBe('Fall 1997');
  });
});
