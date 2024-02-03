const config = {
  image: {
    maxSize: 10_000,
    allowedFormats: ['jpg', 'jpeg', 'gif', 'png'],
    maxWidth: 320,
    maxHeight: 240,
  },
  xhtml: {
    validTags: ['a', 'code', 'i', 'strong'],
  },
};

export default Object.freeze(config);
