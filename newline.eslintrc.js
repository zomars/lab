const ERROR = 2;

const varFlavors = [
  'let',
  'const',
];

// can't add `case` & `default` cause they might follow each other wo any expressions at all
const paddedStatements = [
  'block-like',
  'class',
  'switch',
  'import',
  'export',
  ...varFlavors,
];

const emptyLineBeforeStatements = paddedStatements.concat(
  'return',
);

const emptyLineAfterStatements = paddedStatements.concat();

// overrides, no empty line is required in between
const canFollowEachOther = [
  varFlavors,
  'import',
  'export',
  ['case', 'default'], // when 'case' or 'default' is a block-like
];

// override for overrides - need an empty line in between
const canFollowExceptions = [
  [varFlavors, 'block-like'],
  ['block-like', varFlavors],
  ['block-like', 'case'],
  ['block-like', 'default'],
];

const paddingLineBetweenStatementsRules = [
  [emptyLineAfterStatements, '*'],
  ['*', emptyLineBeforeStatements],
  ...canFollowEachOther.map(list => [list, list, 'any']),
  ...canFollowExceptions,
].map((
  [
    prev,
    next,
    blankLine = 'always',
  ]
) => ({
  prev,
  next,
  blankLine,
}));

const objCurlyNewLineSubConf = {
  multiline: true,
  minProperties: 3,
  consistent: true,
};

const rules = {
  'object-curly-newline': [ERROR, {
    ObjectExpression: objCurlyNewLineSubConf,
    ImportDeclaration: objCurlyNewLineSubConf,
    ExportDeclaration: objCurlyNewLineSubConf,
  }],
  'padding-line-between-statements': [
    ERROR,
    ...paddingLineBetweenStatementsRules,
  ],
};

module.exports = {
  rules,
};
