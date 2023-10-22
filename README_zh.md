# bem-classlist

[![npm version](https://img.shields.io/npm/v/bem-classlist.svg?style=flat)](https://www.npmjs.com/package/bem-classlist)
[![jest tested](https://img.shields.io/badge/Jest-tested-eee.svg?logo=jest&labelColor=99424f)](https://github.com/jestjs/jest)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/breeze9527/bem-classlist/blob/main/LICENSE)

生成[BEM](https://getbem.com/naming/)格式的类名数组

## 安装

```bash
npm install bem-classlist  # 使用npm安装
# 或
yarn add bem-classlist     # 使用yarn安装
```

## 使用

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

### 柯里化

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

- block `<string>`: 块（block）名
- \[element\] `<string>`: 元素（element）名
- \[modifier\] `<string | object | array>`: 修饰符（modifier）配置
- Return `<string[]>`

创建BEM格式的类名数组

修饰符配置(`modifier`)可以是下列类型之一：

- `string`  
  ```ts
  bem('block', 'element', 'mod');
  // => ['block__element', 'block__element--mod']
  ```
- `object`  
  当使用对象配置修饰符时，对象的key即是修饰符的名称，value的作用取决于它的类型：  
  - `true`  
    只添加名称为key的修饰符，不包含它的值
    ```ts
    bem('block', 'element', {mod: true, mod2: true});
    // => ['block__element', 'block__element--mod', 'block__element--mod2']
    ```
  - `undefined` / `null` / `false`  
    省略该修饰符配置
    ```ts
    bem('block', 'element', {mod: null});
    // => ['block__element']
    ```
  - `string` / `number`  
    添加该修饰符与对应的值
    ```ts
    bem('block', 'element', {mod: 'val'});
    // => ['block__element', 'block__element--mod-val']
    bem('block', 'element', {mod: 0});
    // => ['block__element', 'block__element--mod-0']
    ```
  - `string`或`number`组成的数组  
    数组中的每个元素都会按照上述的规则添加到结果中
    ```ts
    bem('block', 'element', {mod: ['val1', 2]});
    // => ['block__element', 'block__element--mod-val1', 'block__element--mod-2']
    ```
- `array`  
  数组中的每个元素都会按照上述的规则添加到结果中
  ```ts
  bem('block', 'element', ['mod1', {mod2: true}, {mod3: 'val3'}])
  // => ['block__element', 'block__element--mod1', 'block__element--mod2', 'block__element--mod3-val3']
  ```

`element`和`modifier`都是可选的，当第二个参数（`element`）的类型是数组或对象时，它会被当作是修饰器（`modifier`），相当于`bem(element, undefined, modifier)`

```ts
bem('block', 'element')
// => ['block__element']
bem('block', ['element'])
// => ['block', 'block--element']
bem('block', {color: 'red'})
// => ['block', 'block--color-red']
```

### createBem(configuration)

- \[configuration\] `<Configuration>`: 自定义配置
- Return`<function>`

#### Configuration

字段名 | 类型 | 描述 | 是否必须 | 默认值
--- | --- | --- | --- | ---
elementPrefix | `string` | 元素（block）前缀 | 否 | `'__'`
modifierPrefix | `string` | 修饰符（modifier）前缀 | 否 | `'--'`
attributePrefix | `string` | 修饰符值的前缀 | 否 | `'-'`
modifierKeyKebabCase | `boolean` | 将修饰符对象的key从驼峰格式（camelCase）转换成短横连接格式（kebab-case） | 否 | `true`
deduplicate | `boolean` | 对结果数组执行去重 | 否 | `true`


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

### bem.block(block)

- `block` \<string\>: 块（block）名
- Return \<string\>

接受一个块名，返回块名固定为该参数的柯里化BEM函数。  
返回的函数接收两个可选的参数，即`element`、`modifier`，参数格式与bem函数的同名参数相同

```ts
import { bem, createBem } from 'bem-classlist';

const block = bem.block('block');
// 或者
const block = createBem().block('block');

block('element1', 'modifier1');
// => ['block__element1', 'block__element1--modifier']

block('element2', 'modifier1');
// => ['block__element2', 'block__element2--modifier']

```
