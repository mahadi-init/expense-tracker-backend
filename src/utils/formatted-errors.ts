export function formatErrorMessage(errorString: string) {
  try {
    // Parse the stringified error array
    const errors = JSON.parse(errorString);

    // If it's not an array, return original message
    if (!Array.isArray(errors)) {
      return errorString;
    }

    // Format each error
    const formattedErrors = errors.map((error: any) => {
      const field = Array.isArray(error.path)
        ? error.path.join(".")
        : "unknown";
      let message = error.message || "Invalid input";

      // Customize messages based on error type
      switch (error.code) {
        case "invalid_type":
          if (error.received === "undefined") {
            message = `${field} is required`;
          } else if (error.received === "null") {
            message = `${field} cannot be null`;
          } else {
            message = `${field} must be a ${error.expected}`;
          }
          break;

        case "too_small":
          if (error.type === "string") {
            message = `${field} must be at least ${error.minimum} characters long`;
          } else if (error.type === "array") {
            message = `${field} must contain at least ${error.minimum} items`;
          } else {
            message = `${field} must be at least ${error.minimum}`;
          }
          break;

        case "too_big":
          if (error.type === "string") {
            message = `${field} must be at most ${error.maximum} characters long`;
          } else if (error.type === "array") {
            message = `${field} must contain at most ${error.maximum} items`;
          } else {
            message = `${field} must be at most ${error.maximum}`;
          }
          break;

        case "invalid_string":
          if (error.validation === "email") {
            message = `${field} must be a valid email address`;
          } else if (error.validation === "url") {
            message = `${field} must be a valid URL`;
          } else if (error.validation === "uuid") {
            message = `${field} must be a valid UUID`;
          } else {
            message = `${field} format is invalid`;
          }
          break;

        case "invalid_enum_value":
          message = `${field} must be one of: ${error.options?.join(", ") || "valid options"}`;
          break;

        case "custom":
          message = error.message || `${field} is invalid`;
          break;

        default:
          // Keep original message for unknown error types
          message = error.message || `${field} is invalid`;
      }

      return {
        field,
        message,
        code: error.code,
      };
    });

    return formattedErrors;
  } catch (parseError) {
    // If parsing fails, return the original string
    console.error("Failed to parse error message:", parseError);
    return errorString;
  }
}
