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
  limit = 5,
): Promise<SpotifyTrack[]> {
  try {
    const token = await getAccessToken();
    const response = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=${limit}&fields=items(track(name,artists(name)))`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    const data: SpotifyPlaylistResponse = await response.json();
    return data.items
      .filter((item) => item.track !== null)
      .map((item) => ({
        title: item.track!.name,
        artist: item.track!.artists.map((a) => a.name).join(", "),
      }));
  } catch (error) {
    console.error("Error fetching Spotify playlist:", error);
    return [];
  }
}
