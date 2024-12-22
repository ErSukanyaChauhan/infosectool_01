import React, { useState } from "react";
import axios from "axios";
import "./ShareLink.css"; // Optional: for styling
import OAuth from "oauth-1.0a";
import CryptoJS from "crypto-js";
const SocialTool = () => {
  const [url, setUrl] = useState("");
  const [metadata, setMetadata] = useState(null);
  const [message, setMessage] = useState("");
  const [isSharing, setIsSharing] = useState(false);
  const [status, setStatus] = useState("");
  const [title, setTitle] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  // Replace these with your Tumblr credentials
  const TUMBLR_CONSUMER_KEY = "53nAwShoU7MjUlSFdMrDShNhjB4fe16bWgAFiUwK5B7Cd7uax0";
  const TUMBLR_CONSUMER_SECRET = "RBNFcs6I0EkJZJ7TghNLkAw0WU4NtYTEJLTvqD3A0Y5x4syxFJ";
  const TUMBLR_TOKEN = "xfTAV6qdJocqougD8X5EzRipStO0N21zX8Tp4zCzAhfJ05F3OI";
  const TUMBLR_TOKEN_SECRET = "cGjOSBW4JgcFqQjPEOPBYKryXpOPGbzD4UydivsVNr02BTyMcg";
  const TUMBLR_BLOG_IDENTIFIER = "storiesshort.tumblr.com";

  const fetchMetadata = async () => {
    try {
      if (status) {
        const response = await axios.get(
          `https://api.linkpreview.net/?key=16b54010b21fdea98cceae6d524ae5ad&q=${encodeURIComponent(status)}`
        );
        setMetadata(response.data);
      }
    } catch (error) {
      console.error("Error fetching metadata:", error);
    }
  };

  const oauth = OAuth({
    consumer: { key: TUMBLR_CONSUMER_KEY, secret: TUMBLR_CONSUMER_SECRET },
    signature_method: "HMAC-SHA1",
    hash_function(base_string, key) {
      return CryptoJS.HmacSHA1(base_string, key).toString(CryptoJS.enc.Base64);
    },
  });
  const shareToTumblr = async () => {
    const requestData = {
      url: `https://api.tumblr.com/v2/blog/${TUMBLR_BLOG_IDENTIFIER}/post`,
      method: "POST",
      data: {
        type: "link",
        url: url,
        title: title || "Check this out!",
        thumbnail: thumbnail || undefined,
      },
    };

    const headers = oauth.toHeader(
      oauth.authorize(requestData, {
        key: TUMBLR_TOKEN,
        secret: TUMBLR_TOKEN_SECRET,
      })
    );

    try {
      // Create the post
      const response = await axios.post(requestData.url, requestData.data, {
        headers: {
          ...headers,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      console.log("Tumblr Post Success:", response.data);

      // Extract the post ID from the response
      const postId = response.data?.response?.id || response.data?.response?.post_id;
      if (!postId) {
        throw new Error("Post ID not returned in response!");
      }
      console.log("Created Post ID:", postId);

      // Fetch metadata for the created post
      const metadata = await fetchPostMetadata(postId);
      console.log("Post Metadata:", metadata);

      return metadata; // Return metadata if needed elsewhere
    } catch (error) {
      console.error("Tumblr Error:", error.response?.data || error.message);
      return null;
    }
  };

  const fetchPostMetadata = async (postId) => {
    const metadataUrl = `https://api.tumblr.com/v2/blog/${TUMBLR_BLOG_IDENTIFIER}/posts?api_key=${TUMBLR_CONSUMER_KEY}&id=${postId}`;
    console.log("Fetching metadata with URL:", metadataUrl);

    try {
      const response = await axios.get(metadataUrl);
      console.log("Fetched Metadata Response:", response.data);
      // Ensure the data structure matches your requirements
      return response.data?.response?.posts[0];
    } catch (error) {
      console.error("Error fetching post metadata:", error.response?.data || error.message);
      return null;
    }
  };

  const shareToTwitter = async () => {
    if (!url.trim()) {
      alert("Please enter a valid URL!");
      return;
    }

    try {
      const twitterApiEndpoint = "http://localhost:4000/api/post-to-twitter";
      const response = await axios.post(twitterApiEndpoint, { url, message });
      console.log("Twitter Response:", response.data);
    } catch (error) {
      console.error("Error sharing to Twitter:", error.response || error.message);
      alert("Failed to post tweet.");
      throw new Error("Failed to share to Twitter.");
    }
  };

  const shareToMastodon = async () => {
    if (!status.trim()) {
      alert("Please enter a valid status!");
      return;
    }

    try {
      const response = await axios.post('http://localhost:4000/api/post-to-mastodon', {
        status,
      });
      console.log('Posted to Mastodon:', response.data);
    } catch (error) {
      console.error('Error posting to Mastodon:', error.response?.data || error.message);
    }
  };

  const handleShare = async () => {
    if (!status.trim() || !url.trim()) {
      alert("Please enter a valid URL!");
      return;
    }

    setIsSharing(true);
    try {
      await Promise.all([shareToTwitter(),
      shareToMastodon(),
      shareToTumblr()
      ]);
      alert("URL successfully shared to Twitter ,Mastodon and Tumbler!");
    } catch (error) {
      alert(error.message);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div style={{ marginLeft:"35%" ,padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>Share URL to Social Platforms</h2>
      <br />
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onBlur={fetchMetadata}
        placeholder="Enter the URL"
        style={{
          padding: "10px",
          width: "400px",
          marginBottom: "10px",
          fontSize: "16px",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      />

      <br />

      {/* Textarea for Mastodon Status */}


      <textarea
        placeholder="Enter your status or URL"
        value={status}
        onBlur={fetchMetadata}
        onChange={(e) => setStatus(e.target.value)} style={{
          display: "block",
          width: "400px",
          height: "100px",
          padding: "10px",
          marginBottom: "10px",
          fontSize: "16px",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      />
      {/* Input for Optional Message */}
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Optional message"
        style={{
          padding: "10px",
          width: "400px",
          marginBottom: "10px",
          fontSize: "16px",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      />

      <br />
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter a title (optional)"
        style={{
          padding: "10px",
          width: "300px",
          marginRight: "10px",
          fontSize: "16px",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      />
      <br />    <br />
      <input
        type="url"
        value={thumbnail}
        onChange={(e) => setThumbnail(e.target.value)}
        placeholder="Enter a thumbnail URL (optional)"
        style={{
          padding: "10px",
          width: "300px",
          marginRight: "10px",
          fontSize: "16px",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      />    <br />
      
      {/* Metadata Preview */}
      {metadata && (
        <div className="preview">
          <img src={metadata.image} alt="Preview" className="preview-image" />
          <div className="preview-details">
            <h3>{metadata.title}</h3>
            <p>{metadata.description}</p>
          </div>
        </div>
      )}
      <br />

      {/* Share Button */}
      <button
        onClick={handleShare}
        disabled={isSharing}
        style={{
          padding: "10px 20px",
          marginLeft:"120px",
          fontSize: "16px",
          backgroundColor: isSharing ? "#ccc" : "#4caf50",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: isSharing ? "not-allowed" : "pointer",
        }}
      >
        {isSharing ? "Sharing..." : "Share Now"}
      </button>
    </div>
  );
};
export default SocialTool;
