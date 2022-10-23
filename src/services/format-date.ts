export const enum dateFormat {
  medium = 'medium',
  short = 'short',
}

export function formatDate(
  dateStr: string,
  type: dateFormat = dateFormat.medium,
): string {
  const date = new Date(dateStr);

  switch (type) {
    case dateFormat.medium:
      return date.toLocaleDateString(
        'en-US', {
          dateStyle: 'medium',
        });

    case dateFormat.short:
      return date.toLocaleDateString(
        'en-US', {
          dateStyle: 'short',
        });
  }

  return '';
}
