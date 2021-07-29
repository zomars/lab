const CAMELCASE = 'camelCase';
const UPPERCASE = 'UPPER_CASE';
const PASCALCASE = 'PascalCase';
const ERROR = 2;

const ALLOW = 'allow';

const variableNamingConvention = {
  selector: 'variable',
  format: [
    CAMELCASE,
    PASCALCASE,
  ],
  leadingUnderscore: ALLOW,
  trailingUnderscore: ALLOW,
};

const constantNamingConvention = {
  selector: 'variable',
  modifiers: [
    'const',
  ],
  format: [
    CAMELCASE,
    PASCALCASE,
    UPPERCASE,
  ],
  leadingUnderscore: ALLOW,
  trailingUnderscore: ALLOW,
};

const propertyNamingConvention = {
  selector: 'property',
  format: null,
};

const classNamingConvention = {
  selector: 'class',
  format: [
    PASCALCASE,
  ],
};

const interfaceNamingConvention = {
  selector: 'interface',
  format: [
    PASCALCASE,
  ],
  prefix: [
    'I',
  ],
};

const rules = {
  '@typescript-eslint/naming-convention': [
      ERROR,
      variableNamingConvention,
      constantNamingConvention,
      propertyNamingConvention,
      classNamingConvention,
      interfaceNamingConvention,
  ],
};

module.exports = {
  rules,
};
