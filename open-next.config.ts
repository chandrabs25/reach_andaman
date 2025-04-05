// open-next.config.ts (Simplified)

const config = {
  default: {
    override: {
      wrapper: "cloudflare-node",
      converter: "edge",
      // Remove or comment out the explicit incrementalCache line
      // incrementalCache: Cache.kv({...}), 
      tagCache: "dummy", 
      queue: "dummy",   
    },
  },

  middleware: {
    external: true,
    override: {
      wrapper: "cloudflare-edge",
      converter: "edge",
      proxyExternalRequest: "fetch",
    },
  },

  dangerous: {
    enableCacheInterception: false,
  },
};

export default config;