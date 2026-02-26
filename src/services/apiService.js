const apiService = {
  fetchData: async (url) => {
    try {
      const response = await fetch("/api/scrape", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });
      return response;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  },

  retrieveData: async () => {
    try {
      const response = await fetch("/api/data", {
        method: "GET",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      if (response.ok) {
        const responseObject = await response.json();
        return responseObject?.content;
      }
      throw new Error("Network response was not ok.");
    } catch (error) {
      console.error("Error retrieving data:", error);
      throw error;
    }
  },

  fetchHistory: async () => {
    try {
      const response = await fetch("/api/fetch-history", {
        method: "GET",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      if (response.ok) {
        return await response.json();
      }
      throw new Error("Network response was not ok.");
    } catch (error) {
      console.error("Error fetching history:", error);
      throw error;
    }
  }
};

export default apiService;
