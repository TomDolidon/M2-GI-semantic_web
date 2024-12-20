const getIdFromUri = (uri) => {
  return uri.split("#")[1];
};

export { getIdFromUri };
