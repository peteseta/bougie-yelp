interface SpotifyTrack {
  title: string;
  artist: string;
}

interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface SpotifyPlaylistResponse {
  items: Array<{
    track: {
      name: string;
      artists: Array<{ name: string }>;
    } | null;
  }>;
  total: number;
  next: string | null;
}

/**
 * Fisher-Yates shuffle to get random elements from an array
 */
function getRandomSubset<T>(array: T[], count: number): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}

async function getAccessToken(): Promise<string> {
  const clientId = import.meta.env.SPOTIFY_CLIENT_ID;
  const clientSecret = import.meta.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Missing Spotify credentials");
  }

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    },
    body: "grant_type=client_credentials",
  });

  const data: SpotifyTokenResponse = await response.json();
  return data.access_token;
}

export async function getPlaylistTracks(
  playlistId: string,
  count = 5,
): Promise<SpotifyTrack[]> {
  try {
    const token = await getAccessToken();
    const allTracks: SpotifyTrack[] = [];
    let nextUrl: string | null =
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=100&fields=items(track(name,artists(name))),total,next`;

    // Fetch all tracks from the playlist (paginated)
    while (nextUrl) {
      const response = await fetch(nextUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data: SpotifyPlaylistResponse = await response.json();

      const tracks = data.items
        .filter((item) => item.track !== null)
        .map((item) => ({
          title: item.track!.name,
          artist: item.track!.artists.map((a) => a.name).join(", "),
        }));

      allTracks.push(...tracks);
      nextUrl = data.next;
    }

    // Return a random subset
    return getRandomSubset(allTracks, Math.min(count, allTracks.length));
  } catch (error) {
    console.error("Error fetching Spotify playlist:", error);
    return [];
  }
}
