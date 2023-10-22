# bem-classlist

[![npm version](https://img.shields.io/npm/v/bem-classlist.svg?style=flat)](https://www.npmjs.com/package/bem-classlist)
![DTS-TypeScript-blue](https://img.shields.io/badge/DTS-TypeScript-blue.svg)
[![jest tested](https://img.shields.io/badge/Jest-tested-eee.svg?logo=jest&labelColor=99424f)](https://github.com/jestjs/jest)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/breeze9527/bem-classlist/blob/main/LICENSE)

Generate [BEM](https://getbem.com/naming/)-style class-name list

## Install

```bash
npm install bem-classlist  # via npm
# or
yarn add bem-classlist     # via yarn
```

## Usage

```ts
import { bem } from 'bem-classlist';

bem('block', 'element');
// => ['block__element']

bem('block', { modifier: true });
// => ['block', 'block--modifier']

bem('block', 'element', 'modifier');
// => ['block__element', 'block__element--modifier']

bem('block', 'element', { modifier: true }); 
// => ['block__element', 'block__element--modifier']

bem('block', 'element', { color: 'red', hasError: false, fontSize: 'small' });
// => ['block__element', 'block__element--color-red', 'block__element--has-error', 'block__element--font-size-small']
```

### Currying

```ts
import { bem } from 'bem-classlist';

const myBlock = bem.block('my-block');

myBlock('my-element', {size: 'large'})
// => ['my-block__my-element', 'my-block__my-element--size-large']

myBlock('my-element2')
// => ['my-block__my-element2']
```

## API

### bem(block, element, modifier)

- block `<string>`: block name
- \[element\] `<string>`: element name
- \[modifier\] `<string | object | array>`: modifier configuration
- Return `<string[]>`: list of bem-style classname

create BEM-styled class name list

the type of `modifier` can be one of following:

- `string`  
  ```ts
  bem('block', 'element', 'mod');
  // => ['block__element', 'block__element--mod']
  ```
- `object`  
  in this case, key of object is modifier name, type of object's value can be...
  - `true`  
    add modifier without value
    ```ts
    bem('block', 'element', {mod: true, mod2: true});
    // => ['block__element', 'block__element--mod', 'block__element--mod2']
    ```
  - `undefined` / `null` / `false`  
    ignore this modifier
    ```ts
    bem('block', 'element', {mod: null});
    // => ['block__element']
    ```
  - `string` / `number`  
    set modifier's value
    ```ts
    bem('block', 'element', {mod: 'val'});
    // => ['block__element', 'block__element--mod-val']
    bem('block', 'element', {mod: 0});
    // => ['block__element', 'block__element--mod-0']
    ```
  - array of `string` or `number`  
    each value of list will be set saparately according to the rules above
    ```ts
    bem('block', 'element', {mod: ['val1', 2]});
    // => ['block__element', 'block__element--mod-val1', 'block__element--mod-2']
    ```
- `array`  
  each value will be set saparately
  ```ts
  bem('block', 'element', ['mod1', {mod2: true}, {mod3: 'val3'}])
  // => ['block__element', 'block__element--mod1', 'block__element--mod2', 'block__element--mod3-val3']
  ```

`element` and `modifier` are both optional, when the type of second parameter (`element`) is an `object` or `array`, it is treated as `modifier`

```ts
bem('block', 'element')
// => ['block__element']
bem('block', ['element'])
// => ['block', 'block--element']
bem('block', {color: 'red'})
// => ['block', 'block--color-red']
```

### createBem(configuration)

- \[configuration\] `<Configuration>`: custom bem setting
- Return`<function>`: bem function

#### Configuration

name | type | description | required | default
--- | --- | --- | --- | ---
elementPrefix | `string` | prefix of element | No | `'__'`
modifierPrefix | `string` | prefix of modifier | No | `'--'`
attributePrefix | `string` | prefix of modifier value | No | `'-'`
modifierKeyKebabCase | `boolean` | convert the key of modifier object from camelcase to kebabcase | No | `true`
deduplicate | `boolean` | remove duplicate items from result | No | `true`


```ts
import { createBem } from 'bem-classlist';
const myBem = createBem({
  elementPrefix: '-E-',
  modifierPrefix: '-M-',
  attributePrefix: '-A-',
  modifierKeyKebabCase: false,
  deduplicate: false,
});

myBem('block', 'element', [{fontSize: 'large'}, {fontSize: 'large'}]);
// => ['block-E-element', 'block-E-element-fontSize-large', 'block-E-element-fontSize-large']

```
