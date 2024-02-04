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
  pagination: {
    take: 25,
    sort: 'desc' as const,
  },
};

export default Object.freeze(config);
