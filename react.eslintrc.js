const OFF = 0;
const ERROR = 2;

const ALWAYS = 'always';
const NEVER = 'never';

const reactHookRules = {
  'react-hooks/rules-of-hooks': ERROR,
  'react-hooks/exhaustive-deps': ERROR,
};

const reactRules = {
  'react/no-unused-prop-types': ERROR,
  'react/no-unused-state': ERROR,
  'react/jsx-child-element-spacing': ERROR,
  'react/jsx-closing-bracket-location': ERROR,
  'react/jsx-curly-brace-presence': [
    ERROR, {
      props: NEVER,
      children: NEVER,
    },
  ],
  'react/jsx-curly-newline': ERROR,
  'react/jsx-curly-spacing': [
    ERROR, {
      when: ALWAYS,
      spacing: {
        objectLiterals: NEVER,
      },
    },
  ],
  'react/jsx-equals-spacing': [
    ERROR,
    ALWAYS,
  ],
  'react/jsx-filename-extension': [
    ERROR, {
      allow: 'as-needed',
      extensions: [
        '.tsx',
      ],
    },
  ],
  'react/jsx-first-prop-new-line': ERROR,
  'react/jsx-fragments': ERROR,
  'react/jsx-indent': [
    ERROR,
    2, {
      checkAttributes: true,
    },
  ],
  'react/jsx-indent-props': [
    ERROR, 2,
  ],
  'react/jsx-max-props-per-line': ERROR,
  'react/jsx-no-bind': [
    ERROR, {
      allowArrowFunctions: true,
    },
  ],
  'react/jsx-no-comment-textnodes': ERROR,
  'react/jsx-no-constructed-context-values': ERROR,
  'react/jsx-no-script-url': ERROR,
  'react/jsx-no-undef': ERROR,
  'react/jsx-no-useless-fragment': ERROR,
  'react/jsx-pascal-case': [
    ERROR, {
      allowNamespace: true,
      allowAllCaps: true,
    },
  ],
  'react/jsx-props-no-multi-spaces': ERROR,
  'react/jsx-tag-spacing': [
    ERROR, {
      beforeSelfClosing: 'never',
    },
  ],
  'react/jsx-wrap-multilines': ERROR,
  'react/react-in-jsx-scope': OFF, // TODO change to h-in-jsx-scope
  ...reactHookRules,
};

module.exports = reactRules;
