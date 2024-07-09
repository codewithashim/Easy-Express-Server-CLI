const handleZodError = (error: any) => {
    const errors = error.issues.map((issue: any) => {
      return {
        path: issue?.path[issue.path.length - 1],
        message: issue?.message,
      };
    });
  
    const statusCode = 400;
  
    return {
      statusCode,
      message: "Validation Error",
      errorMessages: errors,
    };
  };
  
  export default handleZodError;
  