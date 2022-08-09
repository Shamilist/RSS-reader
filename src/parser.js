const getFeedInfo = (data) => {
  const title = data.querySelector('title').textContent;
  const description = data.querySelector('description').textContent;
  return { title, description };
};

const getFeeds = (data) => {
  const items = data.querySelector('item');
  const posts = [];

  items.forEach((item) => {
    const title = item.querySelector('title').textContent;
    const description = item.querySelector('description').textContent;
    const link = item.querySelector('link').textContent;
    const dateOfPub = item.querySelector('dateOfPub');
    const timeOfPub = dateOfPub ? dateOfPub.textContent : '';

    const post = {
      title,
      description,
      link,
      timeOfPub,
    };

    posts.push(post);
  });
  return posts;
};

const rssParser = (response) => {
  const parser = new DOMParser();
  const data = parser.parseFromString(response.data.contents, 'text/xml');
  const parserErr = data.querySelector('parsererror');

  if (parserErr) {
    throw new Error('Parsing Error');
  }

  const feedInfo = getFeedInfo(data);
  const posts = getFeeds(data);

  return { feedInfo, posts };
};

export default rssParser;
