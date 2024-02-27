import { useState } from "react";
import LlamaAI from "llamaai";

const HomePage = () => {
  const [inputMessage, setInputMessage] = useState("");
  const [response, setResponse] = useState("");

  const apiToken =
    "LL-dlIgQVFTLtpQ66uuFfPlW2DMMtbq317E8KmWvS3l6CQv7KB6zmBaeuVKPBfWlyrC";
  const llamaAPI = new LlamaAI(apiToken);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const apiRequestJson = {
        messages: [{ role: "user", content: inputMessage }],
        stream: false,
      };

      const messages = await llamaAPI.run(apiRequestJson);
      console.log(messages.choices[0].message.content);
      if (messages) {
        setResponse(messages.choices[0].message.content);
      } else {
        setResponse("No response received");
      }
    } catch (error) {
      console.error("Error:", error);
      setResponse("Error fetching response");
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(event.target.value);
  };

  return (
    <div>
      <h1>Home Page</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputMessage}
          onChange={handleChange}
          placeholder="Enter your message"
        />
        <button type="submit">Submit</button>
      </form>
      <div>
        <h2>Response:</h2>
        <p>{response}</p>
      </div>
    </div>
  );
};

//
//533713f1-bb41-4363-ae1c-96d1194cfe24
//
//vMcwLS82mNX6NYg3k+TQxaRzMIalsKZaehXmDUH4pDf9d066Ulzh9vgM9/OlC5UUIxeRe/9EMKr

export default HomePage;
