import axios from "axios";

export const uploadImage = async (image) => {
  const {
    data: { uploadUrl },
  } = await axios({
    method: "GET",
    url: import.meta.env.VITE_SERVER_DOMAIN + "/api/v1/blogs/get-upload-url",
  });

  await axios({
    method: "PUT",
    url: uploadUrl,
    headers: { "Content-Type": "multipart/form-data" },
    data: image,
  });

  const imageUrl = uploadUrl.split("?")[0];

  return imageUrl;
};
