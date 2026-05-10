/**
 * Convert a camelCase string to snake_case.
 * Example: "myVariableName" -> "my_variable_name"
 */
export function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, (letter, index) => {
    return index === 0 ? letter.toLowerCase() : `_${letter.toLowerCase()}`;
  });
}

/**
 * Convert a snake_case string to camelCase.
 * Example: "my_variable_name" -> "myVariableName"
 */
export function snakeToCamel(str: string): string {
  return str.replace(/(_\w)/g, (match) => match[1].toUpperCase());
}

// Aliases as requested
export const CamelToSnake = camelToSnake;
export const SnakeToCamel = snakeToCamel;
