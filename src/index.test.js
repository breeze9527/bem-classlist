const {
  bem,
  createBem,
} = require('./index');

describe('createBem()', () => {
  it('shoud be a function', () => {
    expect(createBem).toBeInstanceOf(Function);
  });

  it('configuration should be optional', () => {
    createBem();
    createBem({});
  });

  it('should return a function', () => {
    expect(createBem()).toBeInstanceOf(Function);
  });
});


describe('Generated class-list', () => {
  const cfg = {
    elementPrefix: '#E#',
    modifierPrefix: '#M#',
    attributePrefix: '#A#',
    modifierKeyKebabCase: false,
    deduplicate: false,
  };
  const testBem = createBem(cfg);

  it('should be list of class-name', () => {
    const ret = testBem('any');
    expect(ret).toBeInstanceOf(Array);
    expect(ret).toHaveLength(1);
    ret.forEach(item => {
      expect(typeof item).toBe('string');
    });
  });

  it('should respect bem approach', () => {
    const block = 'Block1';
    const element = 'Element1';
    const base = `${block}${cfg.elementPrefix}${element}`;

    // only block
    expect(testBem('Block1')).toEqual(['Block1']);
    expect(testBem('Block2')).toEqual(['Block2']);

    // block & element
    expect(testBem(block, element)).toEqual([base]);
    expect(testBem(block, element)).toHaveLength(1);

    // boolean modifier
    const mod1 = 'mod1';
    const mod1Res = `${base}${cfg.modifierPrefix}${mod1}`;
    expect(testBem(block, element, mod1)).toEqual([base, mod1Res]);
    expect(testBem(block, element, {[mod1]: false})).toEqual([base]);
    expect(testBem(block, element, {[mod1]: null})).toEqual([base]);
    expect(testBem(block, element, {[mod1]: undefined})).toEqual([base]);
    expect(testBem(block, element, {[mod1]: true})).toEqual([base, mod1Res]);

    // modifier with value
    const mod2 = 'mod2';
    const modVal2 = 'val';
    const mod2ResBase = `${base}${cfg.modifierPrefix}${mod2}`;
    const mod2ResWithVal = `${mod2ResBase}${cfg.attributePrefix}${modVal2}`;
    expect(testBem(block, element, {[mod2]: modVal2})).toEqual([base, mod2ResWithVal]);
    expect(testBem(block, element, {[mod2]: 100})).toEqual([base, `${mod2ResBase}${cfg.attributePrefix}100`]);
    expect(testBem(block, element, {[mod2]: 0})).toEqual([base, `${mod2ResBase}${cfg.attributePrefix}0`]);

    // multiple modifiers
    expect(testBem(block, element, {[mod1]: true, [mod2]: modVal2})).toEqual([base, mod1Res, mod2ResWithVal]);
    expect(testBem(block, element, [{[mod1]: true, [mod2]: modVal2}])).toEqual([base, mod1Res, mod2ResWithVal]);
    expect(testBem(block, element, [{[mod1]: true}, {[mod2]: modVal2}])).toEqual([base, mod1Res, mod2ResWithVal]);

    // modifier value list
    const mod1ResValBase = `${mod1Res}${cfg.attributePrefix}`;
    expect(testBem(block, element, {[mod1]: ['a', 'b', 'c']}))
      .toEqual([base, `${mod1ResValBase}a`, `${mod1ResValBase}b`, `${mod1ResValBase}c`]);
    expect(testBem(block, element, {[mod1]: [1, 2, 3]}))
      .toEqual([base, `${mod1ResValBase}1`, `${mod1ResValBase}2`, `${mod1ResValBase}3`]);
    expect(testBem(block, element, {[mod1]: [true, 1, 2]}))
      .toEqual([base, `${mod1Res}`, `${mod1ResValBase}1`, `${mod1ResValBase}2`]);

    // omit element
    const omitEleBase = `${block}${cfg.modifierPrefix}`
    expect(testBem(block, {mod1: true})).toEqual([block, `${omitEleBase}${mod1}`]);
    expect(testBem(block, {mod1: 'test'})).toEqual([block, `${omitEleBase}${mod1}${cfg.attributePrefix}test`]);
    expect(testBem(block, null, mod1)).toEqual([block, `${omitEleBase}${mod1}`]);
    expect(testBem(block, null, {mod1: true})).toEqual([block, `${omitEleBase}${mod1}`]);
    expect(testBem(block, null, {mod1: 'test'})).toEqual([block, `${omitEleBase}${mod1}${cfg.attributePrefix}test`]);
    expect(testBem(block, undefined, mod1)).toEqual([block, `${omitEleBase}${mod1}`]);
    expect(testBem(block, undefined, {mod1: true})).toEqual([block, `${omitEleBase}${mod1}`]);
    expect(testBem(block, undefined, {mod1: 'test'})).toEqual([block, `${omitEleBase}${mod1}${cfg.attributePrefix}test`]);
  });

  describe('should respect configuration', () => {
    const block = 'Block1';
    const element = 'Element1';

    it('elementPrefix', () => {
      expect(testBem(block, element))
        .toContain(`${block}${cfg.elementPrefix}${element}`);
      expect(testBem(block, element, 'attr'))
        .toContain(`${block}${cfg.elementPrefix}${element}`);
    });

    it('modifierPrefix', () => {
      const mod1 = 'modifier';
      const base = `${block}${cfg.elementPrefix}${element}${cfg.modifierPrefix}`;
      expect(testBem(block, element, mod1))
        .toContain(`${base}${mod1}`);
      expect(testBem(block, element, [mod1]))
        .toContain(`${base}${mod1}`);
      expect(testBem(block, element, {[mod1]: true}))
        .toContain(`${base}${mod1}`);
    });

    it('attributePrefix', () => {
      const mod1 = 'modifier1';
      const base1 = `${block}${cfg.elementPrefix}${element}${cfg.modifierPrefix}${mod1}${cfg.attributePrefix}`;
      expect(testBem(block, element, {[mod1]: 'test'}))
        .toContain(`${base1}test`);
      expect(testBem(block, element, [{[mod1]: 'test'}]))
        .toContain(`${base1}test`);
    });

    it('modifierKeyKebabCase', () => {
      const bem1 = createBem({...cfg, modifierKeyKebabCase: false});
      const bem2 = createBem({...cfg, modifierKeyKebabCase: true});
      const base = `${block}${cfg.modifierPrefix}`;
      const cAttr = 'aTtr';
      const lAttr = 'attr';

      const expCAttr1 = `${base}${cAttr}`;
      expect(bem1(block, null, cAttr)).toContain(expCAttr1);
      expect(bem1(block, [cAttr])).toContain(expCAttr1);
      expect(bem1(block, {[cAttr]: true})).toContain(expCAttr1);
      expect(bem1(block, {[cAttr]: true})).toContain(expCAttr1);

      const expLAttr1 = `${base}${lAttr}`;
      expect(bem1(block, null, lAttr)).toContain(expLAttr1);
      expect(bem1(block, [lAttr])).toContain(expLAttr1);
      expect(bem1(block, {[lAttr]: true})).toContain(expLAttr1);
      expect(bem1(block, {[lAttr]: true})).toContain(expLAttr1);

      const expCAttr2 = `${base}a-ttr`;
      expect(bem2(block, null, cAttr)).toContain(expCAttr2);
      expect(bem2(block, [cAttr])).toContain(expCAttr2);
      expect(bem2(block, {[cAttr]: true})).toContain(expCAttr2);
      expect(bem2(block, {[cAttr]: true})).toContain(expCAttr2);

      const expLAttr2 = `${base}${lAttr}`;
      expect(bem2(block, null, lAttr)).toContain(expLAttr2);
      expect(bem2(block, [lAttr])).toContain(expLAttr2);
      expect(bem2(block, {[lAttr]: true})).toContain(expLAttr2);
      expect(bem2(block, {[lAttr]: true})).toContain(expLAttr2);

      // edge case
      expect(bem2(block, {'AbCd': true})).toContain(`${base}ab-cd`);
      expect(bem2(block, {'Ab1Cd': true})).toContain(`${base}ab1-cd`);
    });

    it('deduplicate', () => {
      const bem1 = createBem({...cfg, deduplicate: false});
      const bem2 = createBem({...cfg, deduplicate: true});

      const res1 = bem1(block, ['a', 'a']);
      const res2 = bem2(block, ['a', 'a']);
      const target = `${block}${cfg.modifierPrefix}a`;

      expect(res1.length - res2.length).toBe(1);
      expect(res1.filter(item => item === target)).toHaveLength(2);
      expect(res2.filter(item => item === target)).toHaveLength(1);
    });
  });

});

describe('bem()', () => {
  const block = 'Block1';
  const element = 'Element1';
  const mod1 = 'mod1';
  const mod2 = 'mod2';
  const mod3 = 'mOd3';
  const mod4 = 'mod4';
  const val1 = 'attr1';
  const result = bem(block, element, [mod1, {[mod2]: val1}, {[mod3]: val1}, mod4, mod4]);

  it('default elementPrefix should be \'__\'', () => {
    expect(result).toContain(`${block}__${element}`);
  });

  it('default modifierPrefix should be \'--\'', () => {
    expect(result).toContain(`${block}__${element}--${mod1}`);
  });

  it('default attributePrefix should be \'-\'', () => {
    expect(result).toContain(`${block}__${element}--${mod2}-${val1}`);
  });

  it('default modifierKeyKebabCase should be true', () => {
    expect(result).toContain(`${block}__${element}--m-od3-${val1}`);
  });

  it('default deduplicate should be true', () => {
    expect(result.filter(item => item === `${block}__${element}--${mod4}`)).toHaveLength(1);
  });
});

describe('bem.block()', () => {
  it('should be a function', () => {
    expect(bem.block).toBeInstanceOf(Function);
  });

  it('should return a function', () => {
    expect(bem.block('block')).toBeInstanceOf(Function);
  });

  it('should work properly', () => {
    const block = 'Block1';
    const element = 'Element1';
    const attr = 'attr';
    const val = 'val';
    const blockBem = bem.block(block);
    const base = `${block}__${element}`;

    // only block
    expect(blockBem()).toEqual([block]);
    expect(blockBem(element)).toEqual([base]);
    expect(blockBem([attr])).toEqual([block, `${block}--${attr}`]);
    expect(blockBem({[attr]: val})).toEqual([block, `${block}--${attr}-${val}`]);
    expect(blockBem(element, attr)).toEqual([base, `${base}--${attr}`]);
    expect(blockBem(element, {[attr]: val})).toEqual([base, `${base}--${attr}-${val}`]);
    expect(blockBem(element, [{[attr]: val}])).toEqual([base, `${base}--${attr}-${val}`]);
  });
});
