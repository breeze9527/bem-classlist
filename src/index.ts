function toKebabCase(str: string) {
  return str.replace(
    /(^|.)([A-Z]+)/g,
    (m, p, t) => `${p ? `${p}-` : ''}${t.toLowerCase()}`,
  )
}
function deduplicate<T>(list: T[]) {
  return list.filter((itm, idx, lst) => lst.indexOf(itm) === idx);
}

type Arraiable<T> = T | T[];
type ModifierItem = string | Record<string, boolean | Arraiable<string | number>>;

const DEFAULT_CONFIG: Required<Config> = {
  elementPrefix: '__',
  modifierPrefix: '--',
  attributePrefix: '-',
  modifierKeyKebabCase: true,
  deduplicate: true,
};

export interface Config {
  elementPrefix?: string;
  modifierPrefix?: string;
  attributePrefix?: string;
  modifierKeyKebabCase?: boolean;
  deduplicate?: boolean;
}


export function createBem(config: Config = {}) {
  const getConfig = <T extends keyof Config>(key: T): Config[T] => {
    return config[key] ?? DEFAULT_CONFIG[key];
  }
  function bem(
    block: string,
    element: string | null,
    modifier?: Arraiable<ModifierItem>,
  ): string[]
  function bem(
    block: string,
    modifier?: Arraiable<ModifierItem>,
  ): string[]
  function bem(
    block: string,
    element?: string | null | Arraiable<ModifierItem>,
    modifier?: Arraiable<ModifierItem>,
  ): string[] {
    if (element && typeof element === 'object') {
      modifier = element;
      element = undefined;
    }

    const result: string[] = [];

    let baseName = block;
    if (element) {
      baseName += `${getConfig('elementPrefix')}${element}`;
    }

    result.push(baseName);

    // process modifiers
    if (modifier) {
      const addModify = (key: string, value: Arraiable<string | number> | true) => {
        const modKey = getConfig('modifierKeyKebabCase') ? toKebabCase(key) : key;
        let modifierStr = `${getConfig('modifierPrefix')}${modKey}`;
        if (value !== true) {
          if (Array.isArray(value)) {
            value.forEach(item => {
              addModify(key, item);
            });
            return;
          }
          modifierStr = `${modifierStr}${getConfig('attributePrefix')}${value}`;
        }
        result.push(`${baseName}${modifierStr}`);
      }
      const modifierList = Array.isArray(modifier) ? modifier : [modifier];
      modifierList.forEach(item => {
        if (!item) {
          return;
        }
        if (typeof item === 'object') {
          Object.keys(item).forEach(key => {
            const val = item[key];
            if (val || val === 0) {
              addModify(key, val);
            }
          });
          return;
        } else {
          addModify(item, true);
        }
      });
    }

    if (getConfig('deduplicate')) {
      return deduplicate(result);
    }
    return result;
  }

  bem.block = function bemBlock(block: string) {
    function blockClasslist(
      element: string | null,
      modifier?: Arraiable<ModifierItem>,
    ): string[];
    function blockClasslist(
      modifier?: Arraiable<ModifierItem>,
    ): string[];
    function blockClasslist(
      element?: string | null | Arraiable<ModifierItem>,
      modifier?: Arraiable<ModifierItem>,
    ): string[] {
      return bem(block, element as string, modifier);
    }
    return blockClasslist;
  }

  return bem;
}

const defaultBem = createBem();
export {
  defaultBem as bem,
};
