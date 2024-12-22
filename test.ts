const Mux = require( "@mux/mux-node");

const { Video } = new Mux({
  tokenId: "A2VeTdT98kkygKdUfvy7vtM4hCTz1IXvzCGnl9azL+pzyu4b3F4YfC8aFqjSyewZ22RkD19onOa",
  tokenSecret: "e69baf20-43a8-4662-ad4c-462ae027e4d3",
});

async function testMux() {
  try {
    console.log("Video object:", Video);
    const asset = await Video.Assets.create({
      input: "https://storage.googleapis.com/muxdemofiles/mux-video-intro.mp4",
      playback_policy: "public",
      test: false,
    });
    console.log("Asset created:", asset);
  } catch (error) {
    console.error("Mux test error:", error);
  }
}

testMux();
