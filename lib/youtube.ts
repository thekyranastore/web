export function getYoutubeEmbedUrl(url: string) {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
  return match ? `https://www.youtube-nocookie.com/embed/${match[1]}` : null;
}
