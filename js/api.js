const api = {
    getPOI: async () => {
      try {
        let response = await fetch(
          // eslint-disable-next-line max-len
          'https://gist.githubusercontent.com/parideis/3c983c92e3a56e90af700e32709d5329/raw/729da2e5a3e91d4169c2abe0f03306d31bbf73b5/position.json'
        );
        return response.json();
      } catch (error) {
        console.error(error);
      }
    }
};

export default api;