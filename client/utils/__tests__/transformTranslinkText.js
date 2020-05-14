import transformTranslinkText from '../transformTranslinkText';

describe('transformTranslinkText', () => {
  it('SFU -> SFU', () => {
    expect(transformTranslinkText('SFU')).toBe('SFU');
  });

  it('COQ STN -> Coquitlam Station', () => {
    expect(transformTranslinkText('COQ STN')).toBe('Coquitlam Station');
  });

  it('METROTOWN STN -> Metrotown Station', () => {
    expect(transformTranslinkText('METROTOWN STN')).toBe('Metrotown Station');
  });

  it('VCC-CLARK STN -> VCC-Clark Station', () => {
    expect(transformTranslinkText('VCC-CLARK STN')).toBe('VCC-Clark Station');
  });
});
