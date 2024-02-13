import * as React from "react";

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [requestError, setRequestError] = React.useState();

  const sendRequest = React.useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      setIsLoading(true);

      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
        });

        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(responseData.message);
        }

        setIsLoading(false);
        return responseData;
      } catch (error) {
        setIsLoading(false);
        setRequestError(error.message);
        throw error;
      }
    },
    []
  );

  const resetError = () => {
    setRequestError(null);
  };
  return { isLoading, requestError, sendRequest, resetError };
};
