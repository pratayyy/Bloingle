import axios from "axios";

export const filterPaginationData = async ({
  createNewArray = false,
  prevDocs,
  newDocs,
  page,
  countRoute,
  param = "",
  user = undefined,
}) => {
  try {
    let obj;

    let headers = {};

    if (user) headers = { Authorization: `Bearer ${user}` };

    if (prevDocs !== null && !createNewArray) {
      obj = { ...prevDocs, results: [...prevDocs.results, ...newDocs], page };
    } else {
      const res = await axios({
        method: "GET",
        url: import.meta.env.VITE_SERVER_DOMAIN + countRoute + param,
        headers,
      });
      const { totalDocs } = res.data;
      obj = { results: newDocs, page: 1, totalDocs };
    }

    return obj;
  } catch (err) {
    console.log(err);
  }
};
