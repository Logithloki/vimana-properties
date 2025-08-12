// Imgur image storage utility
// Sign up at https://api.imgur.com/oauth2/addclient for free API access

export const uploadToImgur = async (file: File, clientId: string): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', 'file');

    const response = await fetch('https://api.imgur.com/3/image', {
      method: 'POST',
      headers: {
        Authorization: `Client-ID ${clientId}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload to Imgur');
    }

    const data = await response.json();
    return data.data.link;
  } catch (error) {
    console.error('Error uploading to Imgur:', error);
    throw error;
  }
};

export const imgurConfig = {
  clientId: process.env.NEXT_PUBLIC_IMGUR_CLIENT_ID || 'your-imgur-client-id',
};
