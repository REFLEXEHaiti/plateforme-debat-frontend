export function getYoutubeEmbedUrl(url: string): string | null {
  if (!url) return null;

  // Déjà un embed
  if (url.includes('youtube.com/embed/')) return url;

  // Formats supportés
  const patterns = [
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
    /youtu\.be\/([a-zA-Z0-9_-]+)/,
    /youtube\.com\/live\/([a-zA-Z0-9_-]+)/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return `https://www.youtube.com/embed/${match[1]}?autoplay=1&rel=0`;
    }
  }

  return null;
}

export function getYoutubeThumbnail(url: string): string {
  const embedUrl = getYoutubeEmbedUrl(url);
  if (!embedUrl) return '';
  const match = embedUrl.match(/embed\/([a-zA-Z0-9_-]+)/);
  if (match) return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
  return '';
}
