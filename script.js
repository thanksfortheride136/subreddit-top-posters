// Replace 'SUBREDDIT_NAME' with the name of the subreddit you want to analyze
const subredditName = "SUBREDDITNAME";

// Function to recursively fetch posts
const fetchPosts = async (after = "", allPosts = []) => {
  if (allPosts.length >= 1000) return allPosts;

  const url = `https://www.reddit.com/r/${subredditName}/top/.json?limit=100&after=${after}`;
  const response = await fetch(url);
  const data = await response.json();
  const posts = data.data.children;

  allPosts.push(...posts);

  if (posts.length === 0 || allPosts.length >= 1000) {
    return allPosts;
  } else {
    const nextAfter = data.data.after;
    return fetchPosts(nextAfter, allPosts);
  }
};

// Function to process posts and find top posters
const findTopPosters = async () => {
  try {
    const posts = await fetchPosts();
    const userPostCounts = {};

    posts.forEach((post) => {
      const author = post.data.author;
      userPostCounts[author] = (userPostCounts[author] || 0) + 1;
    });

    const sortedAuthors = Object.entries(userPostCounts).sort(
      (a, b) => b[1] - a[1],
    );
    sortedAuthors.slice(0, 50).forEach((author) => console.log(author));
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
};

// Start the process
findTopPosters();
