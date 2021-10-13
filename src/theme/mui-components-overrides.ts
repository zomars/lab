export const muiTable = {
  defaultProps: {
    size: 'small',
  },
};

export const muiTableCell = {
  styleOverrides: {
    head: {
      'font-weight': 'var(--aml-font-weight-semibold)',
    },
  },
};

export const muiTableRow = {
  styleOverrides: {
    head: {
      'background-color': 'white',
    },
    root: {
      '&:nth-child(even)': {
        'background-color': 'var(--aml-color-grey-100)',
      },
    },
  },
};
