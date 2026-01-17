import axios from "axios";

export async function generateBackgroundImage(prompt: string) {
  const response = await axios.post(
    "https://YOUR_RAPIDAPI_ENDPOINT_HERE",
    {
      prompt,
      style_id: 4,
      size: "16-9"
    },
    {
      headers: {
        "Content-Type": "application/json",
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY!,
        "X-RapidAPI-Host": process.env.RAPIDAPI_HOST!
      },
      responseType: "json"
    }
  );

  return response.data.result.data[0].origin;
}
